'use client';

import Sidebar from "../components/Sidebar";
import { useState, useEffect, useRef, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import '../contact-finder/contact-finder.css';
import './coach.css';

const TRACKS = [
  'Investment Banking',
  'Consulting',
  'Private Equity',
  'Quant Finance',
  'Asset & Wealth Mgmt',
  'Audit & Accounting',
];

// SVG icon components
const ICONS = {
  mail: <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24"><rect x="2" y="4" width="20" height="16" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/></svg>,
  chat: <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>,
  chart: <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24"><rect x="3" y="12" width="4" height="9" rx="1"/><rect x="10" y="6" width="4" height="15" rx="1"/><rect x="17" y="3" width="4" height="18" rx="1"/></svg>,
  users: <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>,
  clock: <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>,
  file: <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8Z"/><polyline points="14 2 14 8 20 8"/></svg>,
  brain: <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24"><path d="M12 2a7 7 0 0 0-7 7c0 3.5 2.5 6.5 6 7v6h2v-6c3.5-.5 6-3.5 6-7a7 7 0 0 0-7-7z"/></svg>,
  target: <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="6"/><circle cx="12" cy="12" r="2"/></svg>,
  code: <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24"><polyline points="16 18 22 12 16 6"/><polyline points="8 6 2 12 8 18"/></svg>,
  scale: <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24"><path d="M12 3v18"/><path d="m4 7 4-4 4 4"/><path d="m12 7 4-4 4 4"/><path d="M4 7v4a4 4 0 0 0 8 0V7"/><path d="M12 7v4a4 4 0 0 0 8 0V7"/></svg>,
  shield: <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>,
  search: <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg>,
  dollar: <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24"><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>,
  book: <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/></svg>,
  layers: <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24"><polygon points="12 2 2 7 12 12 22 7 12 2"/><polyline points="2 17 12 22 22 17"/><polyline points="2 12 12 17 22 12"/></svg>,
  check: <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24"><path d="M9 11l3 3L22 4"/><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"/></svg>,
  building: <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24"><rect x="4" y="2" width="16" height="20" rx="2"/><path d="M9 22v-4h6v4"/><path d="M8 6h.01M16 6h.01M8 10h.01M16 10h.01M8 14h.01M16 14h.01"/></svg>,
};

type Feature = {
  icon: React.ReactNode;
  color: string;
  title: string;
  desc: string;
  prompt: string;
};

const TRACK_FEATURES: Record<string, Feature[]> = {
  'Investment Banking': [
    { icon: ICONS.mail, color: 'purple', title: 'Cold email feedback', desc: 'Get line-by-line edits on your outreach to bankers and MDs.', prompt: 'Review my cold email to an investment banker and give me specific, line-by-line edits:\n\n[paste your email here]' },
    { icon: ICONS.chat, color: 'green', title: 'Behavioral story prep', desc: 'Craft your "Why IB?" and "Tell me about yourself" answers.', prompt: 'Help me craft my "Why investment banking?" answer. I go to [school], I\'ve done [experience], and I\'m targeting [firm].' },
    { icon: ICONS.chart, color: 'blue', title: 'Technical drill', desc: 'Practice DCF, valuation, accounting, and M&A questions.', prompt: 'Give me an IB technical drill. Ask me DCF, valuation, accounting, and M&A questions one at a time with instant feedback.' },
    { icon: ICONS.users, color: 'amber', title: 'Coffee chat prep', desc: 'Prepare for networking calls with analysts, associates, and VPs.', prompt: 'I have a coffee chat with a [title] at [bank] this week. What IB-specific questions should I ask, and what should I avoid?' },
    { icon: ICONS.clock, color: 'teal', title: 'Offer & timeline strategy', desc: 'Navigate superday timelines, exploding offers, and bank communications.', prompt: 'I need help navigating my IB offer timeline. I have [offer details] and need to communicate with [other banks]. What\'s my strategy?' },
    { icon: ICONS.file, color: 'rose', title: 'Resume & deal list review', desc: 'Refine your resume, deal experience, and LinkedIn for banking.', prompt: 'Review my investment banking resume and deal list. Give me specific feedback on formatting, content, and positioning for [target banks].' },
  ],
  'Consulting': [
    { icon: ICONS.mail, color: 'purple', title: 'Cold email feedback', desc: 'Polish your outreach to consultants at MBB and other firms.', prompt: 'Review my cold email to a consultant and give me specific, line-by-line edits:\n\n[paste your email here]' },
    { icon: ICONS.chat, color: 'green', title: 'Behavioral story prep', desc: 'Nail "Why consulting?" and leadership-focused behavioral answers.', prompt: 'Help me craft my "Why consulting?" answer. I go to [school], I\'ve done [experience], and I\'m targeting [firm like McKinsey/BCG/Bain].' },
    { icon: ICONS.target, color: 'blue', title: 'Case interview drill', desc: 'Practice frameworks, market sizing, and profitability cases.', prompt: 'Give me a consulting case interview drill. Start with a market sizing question, then move to a profitability case. Give feedback after each answer.' },
    { icon: ICONS.users, color: 'amber', title: 'Coffee chat prep', desc: 'Prepare smart questions for informational calls with consultants.', prompt: 'I have a coffee chat with a [title] at [consulting firm] this week. What consulting-specific questions should I ask?' },
    { icon: ICONS.clock, color: 'teal', title: 'Offer & timeline strategy', desc: 'Handle offer deadlines across MBB, Big 4, and boutique firms.', prompt: 'I need help with my consulting offer situation. I have an offer from [firm] and am waiting on [other firms]. What\'s my communication strategy?' },
    { icon: ICONS.file, color: 'rose', title: 'Resume & experience review', desc: 'Tailor your resume for impact-driven consulting applications.', prompt: 'Review my consulting resume. Help me rewrite my bullets to emphasize impact, leadership, and analytical skills for [target firms].' },
  ],
  'Private Equity': [
    { icon: ICONS.mail, color: 'purple', title: 'Cold email feedback', desc: 'Refine outreach to PE associates and principals at target funds.', prompt: 'Review my cold email to someone at a PE fund and give me specific, line-by-line edits:\n\n[paste your email here]' },
    { icon: ICONS.chat, color: 'green', title: 'Behavioral story prep', desc: 'Build your "Why PE?" story and deal walk-through narrative.', prompt: 'Help me craft my "Why private equity?" answer. I\'m coming from [bank/role], I\'ve worked on [deals], and I\'m targeting [fund type].' },
    { icon: ICONS.chart, color: 'blue', title: 'LBO & technical drill', desc: 'Practice LBO modeling, returns analysis, and deal mechanics.', prompt: 'Give me a PE technical drill. Ask me LBO mechanics, returns analysis, and deal structuring questions one at a time with feedback.' },
    { icon: ICONS.users, color: 'amber', title: 'Coffee chat prep', desc: 'Prepare for conversations with PE professionals about their portfolio.', prompt: 'I have a coffee chat with a [title] at [PE fund] this week. What PE-specific questions show I understand the business?' },
    { icon: ICONS.layers, color: 'teal', title: 'Case study prep', desc: 'Practice PE investment memos and case study presentations.', prompt: 'Walk me through how to approach a PE case study / investment memo. What structure should I use and what do interviewers look for?' },
    { icon: ICONS.file, color: 'rose', title: 'Resume & deal sheet review', desc: 'Polish your deal experience and position yourself for on-cycle.', prompt: 'Review my PE resume and deal sheet. Help me position my banking experience for [target PE fund type — megafund/MM/growth].' },
  ],
  'Quant Finance': [
    { icon: ICONS.mail, color: 'purple', title: 'Cold email feedback', desc: 'Polish outreach to quant researchers and portfolio managers.', prompt: 'Review my cold email to a quant professional and give me specific, line-by-line edits:\n\n[paste your email here]' },
    { icon: ICONS.chat, color: 'green', title: 'Behavioral story prep', desc: 'Articulate your quantitative background and "Why quant?" story.', prompt: 'Help me craft my "Why quant finance?" answer. My background is in [math/CS/physics/etc.], I\'ve done [experience], and I\'m targeting [firm type].' },
    { icon: ICONS.code, color: 'blue', title: 'Brainteaser & math drill', desc: 'Practice probability, statistics, and mental math questions.', prompt: 'Give me a quant interview drill. Ask me probability, expected value, and brainteaser questions one at a time with detailed explanations.' },
    { icon: ICONS.users, color: 'amber', title: 'Coffee chat prep', desc: 'Prepare technical and strategic questions for quant professionals.', prompt: 'I have a coffee chat with a [quant researcher/PM/trader] at [firm] this week. What questions show I understand the quant space?' },
    { icon: ICONS.clock, color: 'teal', title: 'Offer & timeline strategy', desc: 'Navigate offers across hedge funds, prop shops, and market makers.', prompt: 'I need help with my quant offer situation. I have an offer from [firm] and am interviewing at [other firms]. How should I handle timelines?' },
    { icon: ICONS.file, color: 'rose', title: 'Resume & project review', desc: 'Highlight research, coding projects, and quantitative skills.', prompt: 'Review my quant finance resume. Help me better showcase my research, coding projects, and quantitative skills for [target firms].' },
  ],
  'Asset & Wealth Mgmt': [
    { icon: ICONS.mail, color: 'purple', title: 'Cold email feedback', desc: 'Refine outreach to portfolio managers and wealth advisors.', prompt: 'Review my cold email to an asset/wealth management professional and give me specific, line-by-line edits:\n\n[paste your email here]' },
    { icon: ICONS.chat, color: 'green', title: 'Behavioral story prep', desc: 'Craft your "Why AM?" story and client-focused narratives.', prompt: 'Help me craft my "Why asset management?" answer. I go to [school], I\'ve done [experience], and I\'m targeting [firm].' },
    { icon: ICONS.dollar, color: 'blue', title: 'Stock pitch & market drill', desc: 'Practice stock pitches, portfolio construction, and market views.', prompt: 'Help me prepare a stock pitch for an AM interview. Walk me through the structure and then quiz me on market and portfolio questions.' },
    { icon: ICONS.users, color: 'amber', title: 'Coffee chat prep', desc: 'Prepare for conversations with PMs, analysts, and advisors.', prompt: 'I have a coffee chat with a [title] at [AM/WM firm] this week. What questions should I ask to stand out?' },
    { icon: ICONS.clock, color: 'teal', title: 'Offer & timeline strategy', desc: 'Navigate recruiting timelines across AM and wealth management firms.', prompt: 'I need help with my asset management offer situation. I have [offer details] and need to manage communications with [other firms].' },
    { icon: ICONS.file, color: 'rose', title: 'Resume & pitch review', desc: 'Polish your resume, stock pitches, and investment write-ups.', prompt: 'Review my asset management resume and stock pitch. Help me position my experience for [target AM/WM firms].' },
  ],
  'Audit & Accounting': [
    { icon: ICONS.mail, color: 'purple', title: 'Cold email feedback', desc: 'Polish outreach to partners, managers, and campus recruiters.', prompt: 'Review my cold email to an accounting professional and give me specific, line-by-line edits:\n\n[paste your email here]' },
    { icon: ICONS.chat, color: 'green', title: 'Behavioral story prep', desc: 'Craft "Why audit?" and "Why this firm?" answers that stand out.', prompt: 'Help me craft my "Why audit/accounting?" answer. I go to [school], I\'m studying [major], and I\'m targeting [Big 4/firm].' },
    { icon: ICONS.book, color: 'blue', title: 'Technical drill', desc: 'Practice GAAP, audit procedures, and accounting fundamentals.', prompt: 'Give me an accounting technical drill. Ask me about GAAP, journal entries, audit procedures, and financial statement analysis one at a time.' },
    { icon: ICONS.users, color: 'amber', title: 'Coffee chat prep', desc: 'Prepare for networking calls with auditors and advisory staff.', prompt: 'I have a coffee chat with a [title] at [Big 4/accounting firm] this week. What questions should I ask about their practice?' },
    { icon: ICONS.shield, color: 'teal', title: 'CPA & career path strategy', desc: 'Plan your CPA timeline, service line choice, and exit opportunities.', prompt: 'Help me think through my accounting career path. I\'m interested in [audit/tax/advisory] and want to understand CPA timing and exit opportunities.' },
    { icon: ICONS.file, color: 'rose', title: 'Resume & application review', desc: 'Tailor your resume for Big 4 and mid-market accounting firms.', prompt: 'Review my accounting resume. Help me position my coursework and experience for [Big 4/target firm] applications.' },
  ],
};

const TRACK_QUICK_PROMPTS: Record<string, string[]> = {
  'Investment Banking': [
    'How many times should I follow up?',
    'Walk me through a DCF',
    "What's a strong cold email subject line?",
    'How do I prep for a superday?',
  ],
  'Consulting': [
    'How do I structure a case?',
    'Walk me through market sizing',
    "What's the difference between MBB?",
    'How do I prep for a fit interview?',
  ],
  'Private Equity': [
    'Walk me through an LBO',
    'How does on-cycle recruiting work?',
    'What do PE firms look for in a resume?',
    'How do I prepare a deal walk-through?',
  ],
  'Quant Finance': [
    'Give me a probability brainteaser',
    'What coding languages should I know?',
    'How do prop shops differ from hedge funds?',
    'Walk me through expected value',
  ],
  'Asset & Wealth Mgmt': [
    'How do I structure a stock pitch?',
    'What do AM firms look for?',
    "Walk me through portfolio construction",
    'How do I talk about markets?',
  ],
  'Audit & Accounting': [
    'What do Big 4 interviews look like?',
    'When should I start studying for the CPA?',
    'Audit vs. tax vs. advisory — how to choose?',
    'How do I stand out in accounting recruiting?',
  ],
};

const SYSTEM = `You are Coach — an elite finance recruiting advisor. You have deep expertise in investment banking, private equity, hedge funds, consulting, and all aspects of finance recruiting. You help students with cold emails, networking, coffee chats, interview prep, recruiting stories, and offer decisions.

Be direct, specific, and warm — like a brilliant older friend who went through the process. Never give generic advice. When reviewing emails or stories, rewrite them. Remember everything in the conversation and build on it. Keep responses well-formatted with clear paragraphs. Use bullet points when listing multiple things. Always end with a specific follow-up question or next action.`;

type Message = { role: 'user' | 'assistant'; content: string };

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

export default function CoachPage() {
  const router = useRouter();
  const [activeTrack, setActiveTrack] = useState('Investment Banking');
  const [chatOpen, setChatOpen] = useState(false);
  const [chatLabel, setChatLabel] = useState('');
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [inputVal, setInputVal] = useState('');
  const [isDark, setIsDark] = useState(false);
  const [userName, setUserName] = useState({ first: '', last: '' });
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const welcomeInputRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const stored = window.localStorage.getItem('offerbell_user_id');
    const plan = window.localStorage.getItem('offerbell_plan') || 'free';
    let profilePlan = 'free';
    try {
      const prof = JSON.parse(window.localStorage.getItem('offerbell_onboarding_profile') || '{}');
      profilePlan = prof.plan || 'free';
    } catch {}
    if (plan !== 'pro' && profilePlan !== 'pro') { router.replace('/dashboard?upgrade=coach'); return; }
    if (!stored) { router.replace('/signin'); return; }
    const theme = localStorage.getItem('offerbell-theme');
    if (theme === 'dark') { document.documentElement.setAttribute('data-theme', 'dark'); setIsDark(true); }
    try {
      const raw = localStorage.getItem('offerbell_onboarding_profile');
      if (raw) { const p = JSON.parse(raw); setUserName({ first: p.firstName || '', last: p.lastName || '' }); }
    } catch {}
  }, [router]);

  const scrollBottom = useCallback(() => {
    setTimeout(() => messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' }), 50);
  }, []);

  const getSystemWithTrack = () => {
    return SYSTEM + `\n\nThe user is currently on the "${activeTrack}" recruiting track. Tailor your advice specifically for ${activeTrack} recruiting when relevant.`;
  };

  const sendMessage = async (text: string) => {
    if (isLoading || !text.trim()) return;
    const userMsg: Message = { role: 'user', content: text.trim() };
    const newMessages = [...messages, userMsg];
    setMessages(newMessages);
    setInputVal('');
    setIsLoading(true);
    scrollBottom();
    if (textareaRef.current) textareaRef.current.style.height = 'auto';

    try {
      const res = await fetch('/api/coach', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: newMessages,
          system: getSystemWithTrack(),
          track: activeTrack,
        }),
      });
      const data = await res.json();
      const reply = data.text || data.error || 'Something went wrong — please try again.';
      setMessages((prev) => [...prev, { role: 'assistant', content: reply }]);
    } catch (err: any) {
      setMessages((prev) => [...prev, { role: 'assistant', content: 'Connection error: ' + (err?.message || 'please try again.') }]);
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

  const openChat = (label: string, prompt?: string) => {
    setChatLabel(label);
    setChatOpen(true);
    if (prompt) {
      setInputVal(prompt);
      setTimeout(() => textareaRef.current?.focus(), 100);
    }
  };

  const startNewConversation = () => {
    setMessages([]);
    setInputVal('');
    setChatLabel('');
    setChatOpen(true);
    setTimeout(() => textareaRef.current?.focus(), 100);
  };

  const closeChat = () => {
    setChatOpen(false);
  };

  const clearAndClose = () => {
    setMessages([]);
    setInputVal('');
    setChatLabel('');
    setChatOpen(false);
  };

  const handleWelcomeSubmit = () => {
    if (!inputVal.trim()) return;
    openChat('Conversation', undefined);
    // Need to send the message after chat opens
    setTimeout(() => sendMessage(inputVal), 150);
  };

  const handleWelcomeKey = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleWelcomeSubmit();
    }
  };

  return (
    <div className="app">
      <Sidebar activePage="coach" />

      <main className="coach-main">
        {/* ── Hero ── */}
        <div className="coach-hero">
          <div className="coach-hero-content">
            <div className="coach-hero-label">AI Recruiting Coach</div>
            <h1 className="coach-hero-title">Hey, I&apos;m your <em>Coach.</em></h1>
            <p className="coach-hero-desc">
              Ask anything about finance recruiting — cold emails, your story, interview prep,
              and coffee chats. Get tailored guidance for investment banking, consulting,
              private equity, quant finance, asset &amp; wealth management, and
              audit/accounting.
            </p>
            <div className="coach-hero-stats">
              <span className="coach-stat"><span className="coach-stat-dot green" />5+ career tracks</span>
              <span className="coach-stat"><span className="coach-stat-dot blue" />200+ prompts</span>
              <span className="coach-stat"><span className="coach-stat-dot red" />Updated weekly</span>
            </div>
          </div>

          <div className="coach-quickstart">
            <div className="coach-quickstart-label">Quick Start</div>
            <p className="coach-quickstart-text">
              Tell me where you&apos;re recruiting and what you&apos;re stuck on. I&apos;ll break it into
              next steps, templates, and practice questions.
            </p>
            <button className="coach-quickstart-btn" onClick={startNewConversation} type="button">
              Start a new conversation
            </button>
            <div className="coach-quickstart-footer">
              Coach remembers your previous chats and adapts as your recruiting process evolves.
            </div>
          </div>
        </div>

        {/* ── Track Selector ── */}
        <div className="coach-tracks-section">
          <div className="coach-tracks-header">
            <h2 className="coach-tracks-title">Choose your recruiting track</h2>
            <span className="coach-tracks-hint">Switch tracks anytime — prompts will adapt automatically.</span>
          </div>
          <div className="coach-tracks-pills">
            {TRACKS.map((track) => (
              <button
                key={track}
                className={`coach-track-pill${activeTrack === track ? ' active' : ''}`}
                onClick={() => setActiveTrack(track)}
                type="button"
              >
                {track}
              </button>
            ))}
          </div>
        </div>

        {/* ── Feature Cards ── */}
        <div className="coach-features-section">
          <h2 className="coach-features-title">What do you want help with?</h2>
          <div className="coach-features-grid">
            {(TRACK_FEATURES[activeTrack] || TRACK_FEATURES['Investment Banking']).map((f) => (
              <div key={f.title} className="coach-feature-card" onClick={() => openChat(f.title, f.prompt)}>
                <div className="coach-feature-header">
                  <div className={`coach-feature-icon ${f.color}`}>{f.icon}</div>
                  <div>
                    <div className="coach-feature-title">{f.title}</div>
                    <div className="coach-feature-desc">{f.desc}</div>
                  </div>
                </div>
                <button className={`coach-feature-cta ${f.color}`} type="button">Start with this</button>
              </div>
            ))}
          </div>
        </div>

        {/* ── Conversation Input ── */}
        <div className="coach-conversation-section">
          <div className="coach-conversation-header">
            <h2 className="coach-conversation-title">Conversation</h2>
            <span className="coach-conversation-hint">Shift+Enter for new line · Coach remembers your full conversation</span>
          </div>
          <div className="coach-quick-prompts">
            {(TRACK_QUICK_PROMPTS[activeTrack] || TRACK_QUICK_PROMPTS['Investment Banking']).map((qp) => (
              <button key={qp} className="coach-qp" onClick={() => { openChat(qp); setTimeout(() => sendMessage(qp), 150); }} type="button">{qp}</button>
            ))}
          </div>
          <div className="coach-input-box">
            <div className="coach-input-sparkle">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M12 0L14.59 8.41L23 11L14.59 13.59L12 22L9.41 13.59L1 11L9.41 8.41L12 0Z" opacity="0.6"/></svg>
            </div>
            <textarea
              ref={welcomeInputRef}
              className="chat-input"
              placeholder="Ask anything about recruiting..."
              rows={1}
              value={inputVal}
              onChange={(e) => { setInputVal(e.target.value); autoResize(e.target); }}
              onKeyDown={handleWelcomeKey}
            />
            <button className="send-btn" onClick={handleWelcomeSubmit} disabled={!inputVal.trim()} type="button">
              <svg width="16" height="16" fill="none" viewBox="0 0 24 24"><path d="M5 12h14M12 5l7 7-7 7" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
            </button>
          </div>
        </div>
      </main>

      {/* ── Chat Overlay ── */}
      {chatOpen && (
        <div className="coach-chat-overlay">
          <div className="coach-chat-topbar">
            <div className="coach-chat-topbar-left">
              <button className="coach-chat-back" onClick={closeChat} type="button">
                <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M19 12H5M12 19l-7-7 7-7" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
                Back
              </button>
              {chatLabel && <span className="coach-chat-title">{chatLabel}</span>}
            </div>
            <button className="coach-chat-new" onClick={() => { setMessages([]); setInputVal(''); setChatLabel('New conversation'); }} type="button">
              New conversation
            </button>
          </div>

          <div className="coach-chat-messages">
            <div className="coach-chat-messages-inner">
              {messages.length === 0 && !isLoading && (
                <div style={{ textAlign: 'center', padding: '60px 24px', color: 'var(--text-3)', fontSize: '14px' }}>
                  {inputVal ? 'Press Enter or click send to start the conversation.' : 'Start typing below to begin your coaching session.'}
                </div>
              )}
              {messages.map((m, i) => (
                m.role === 'user' ? (
                  <div key={i} className="msg user">
                    <div className="user-bubble">{m.content}</div>
                  </div>
                ) : (
                  <div key={i} className="msg coach-msg">
                    <div className="coach-avi">K</div>
                    <div className="coach-body">
                      <div className="coach-name">Coach</div>
                      <div className="coach-text" dangerouslySetInnerHTML={{ __html: formatText(m.content) }} />
                    </div>
                  </div>
                )
              ))}
              {isLoading && (
                <div className="msg coach-msg">
                  <div className="coach-avi">K</div>
                  <div className="coach-body">
                    <div className="coach-name">Coach</div>
                    <div className="typing-dots"><span /><span /><span /></div>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>
          </div>

          <div className="coach-chat-input-area">
            <div className="coach-chat-input-inner">
              <div className="coach-chat-input-box">
                <textarea
                  ref={textareaRef}
                  className="chat-input"
                  placeholder="Ask anything about recruiting..."
                  rows={1}
                  value={inputVal}
                  onChange={(e) => { setInputVal(e.target.value); autoResize(e.target); }}
                  onKeyDown={handleKey}
                />
                <button className="send-btn" onClick={() => sendMessage(inputVal)} disabled={isLoading || !inputVal.trim()} type="button">
                  {isLoading ? <div className="coach-spinner" /> : <svg width="16" height="16" fill="none" viewBox="0 0 24 24"><path d="M5 12h14M12 5l7 7-7 7" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/></svg>}
                </button>
              </div>
              <div className="coach-chat-footer">
                <span className="coach-chat-footer-hint">Shift+Enter for new line · Coach remembers your full conversation</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
