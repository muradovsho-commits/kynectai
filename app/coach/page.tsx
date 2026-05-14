'use client';

import Sidebar from "../components/Sidebar";
import { useState, useEffect, useRef, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { useMutation } from 'convex/react';
import { ConvexHttpClient } from 'convex/browser';
import { api } from '../../convex/_generated/api';
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
  'Growth Equity',
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
  ],
  'Private Equity': [
    { icon: ICONS.mail, title: 'Cold email feedback', desc: 'Outreach to PE associates & principals', prompt: 'Review my cold email to someone at a PE fund and give me specific edits:\n\n[paste your email here]' },
    { icon: ICONS.chat, title: 'Behavioral story prep', desc: 'Why PE? Deal walk-through', prompt: 'Help me craft my "Why PE?" answer. I\'m coming from [bank/role] and targeting [fund type].' },
    { icon: ICONS.chart, title: 'LBO & technical drill', desc: 'Returns, modeling, deal mechanics', prompt: 'Give me a PE technical drill. LBO mechanics, returns analysis, and deal structuring.' },
    { icon: ICONS.users, title: 'Coffee chat prep', desc: 'Portfolio & deal discussions', prompt: 'I have a coffee chat with a [title] at [PE fund]. What PE-specific questions show I understand the business?' },
    { icon: ICONS.layers, title: 'Case study prep', desc: 'Investment memos & presentations', prompt: 'Walk me through how to approach a PE case study / investment memo.' },
  ],
  'Consulting': [
    { icon: ICONS.mail, title: 'Cold email feedback', desc: 'Outreach to MBB consultants', prompt: 'Review my cold email to a consultant and give me specific, line-by-line edits:\n\n[paste your email here]' },
    { icon: ICONS.chat, title: 'Behavioral story prep', desc: 'Why consulting? Leadership stories', prompt: 'Help me craft my "Why consulting?" answer. I go to [school], I\'ve done [experience], and I\'m targeting [firm].' },
    { icon: ICONS.target, title: 'Case interview drill', desc: 'Frameworks, sizing, profitability', prompt: 'Give me a consulting case interview drill. Start with a market sizing question, then a profitability case.' },
    { icon: ICONS.users, title: 'Coffee chat prep', desc: 'Smart questions for consultants', prompt: 'I have a coffee chat with a [title] at [consulting firm]. What consulting-specific questions should I ask?' },
    { icon: ICONS.clock, title: 'Offer & timeline', desc: 'MBB, Big 4, boutique deadlines', prompt: 'I have a consulting offer from [firm] and am waiting on [other firms]. What\'s my strategy?' },
  ],
  'Asset Management': [
    { icon: ICONS.mail, title: 'Cold email feedback', desc: 'Outreach to PMs & analysts', prompt: 'Review my cold email to an asset management professional:\n\n[paste your email here]' },
    { icon: ICONS.chat, title: 'Behavioral story prep', desc: 'Why AM? Investment philosophy', prompt: 'Help me craft my "Why asset management?" answer for [firm].' },
    { icon: ICONS.dollar, title: 'Stock pitch drill', desc: 'Pitch structure, variant perception', prompt: 'Help me build a stock pitch for an AM interview. Walk me through the framework and critique my thesis.' },
    { icon: ICONS.chart, title: 'Technical drill', desc: 'Valuation, macro, portfolio theory', prompt: 'Give me an AM technical drill covering valuation methodologies, macro concepts, and portfolio construction.' },
    { icon: ICONS.users, title: 'Coffee chat prep', desc: 'Questions about strategy & AUM', prompt: 'I have a coffee chat with a [PM/analyst] at [AM firm]. What should I ask?' },
  ],
  'Accounting & Audit': [
    { icon: ICONS.mail, title: 'Cold email feedback', desc: 'Outreach to Big 4 professionals', prompt: 'Review my cold email to an accounting professional:\n\n[paste your email here]' },
    { icon: ICONS.chat, title: 'Behavioral story prep', desc: 'Why audit? Why this firm?', prompt: 'Help me craft my "Why accounting/audit?" answer for [firm].' },
    { icon: ICONS.shield, title: 'Technical drill', desc: 'GAAP, audit procedures, standards', prompt: 'Give me an accounting technical drill. Ask me questions on GAAP, audit procedures, and financial statements.' },
    { icon: ICONS.users, title: 'Coffee chat prep', desc: 'Questions for Big 4 professionals', prompt: 'I have a coffee chat with someone at [Big 4 firm]. What should I ask about their practice?' },
    { icon: ICONS.clock, title: 'Offer & timeline', desc: 'Big 4 vs mid-tier decisions', prompt: 'Help me decide between offers from [firms] and navigate the timeline.' },
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
  ],
  'Venture Capital': [
    { icon: ICONS.mail, title: 'Cold email feedback', desc: 'Outreach to VC investors', prompt: 'Review my cold email to a VC associate or partner:\n\n[paste your email here]' },
    { icon: ICONS.chat, title: 'Behavioral story prep', desc: 'Why VC? Sector thesis', prompt: 'Help me craft my "Why venture capital?" answer. I\'m excited about [sector] because [thesis].' },
    { icon: ICONS.search, title: 'Company deep-dive prep', desc: 'Startup analysis & metrics', prompt: 'Help me prepare a deep-dive on [company/startup] for a VC interview. Evaluate their product, metrics, team, and market.' },
    { icon: ICONS.layers, title: 'Pitch deck evaluation', desc: 'Would you invest? Framework', prompt: 'Walk me through how to evaluate a startup pitch deck. What do I look for in each section?' },
    { icon: ICONS.dollar, title: 'Fund math & deal terms', desc: 'Ownership, dilution, term sheets', prompt: 'Quiz me on VC fund economics, ownership math, and term sheet concepts like liquidation preference and anti-dilution.' },
  ],
  'Growth Equity': [
    { icon: ICONS.mail, title: 'Cold email feedback', desc: 'Outreach to GE professionals', prompt: 'Review my cold email to a growth equity investor or associate:\n\n[paste your email here]' },
    { icon: ICONS.chat, title: 'Behavioral story prep', desc: 'Why GE? Why not VC or PE?', prompt: 'Help me craft my "Why growth equity?" answer and differentiate it from PE and VC.' },
    { icon: ICONS.chart, title: 'Technical drill', desc: 'Unit economics, SaaS, cohort analysis', prompt: 'Give me a growth equity technical drill. Ask me about unit economics, LTV/CAC, Rule of 40, net dollar retention, cohort analysis, and growth-stage valuation.' },
    { icon: ICONS.layers, title: 'Investment memo prep', desc: 'Evaluate a high-growth company', prompt: 'Help me build a growth equity investment memo for a company growing 50%+ YoY. Walk me through market size, competitive positioning, unit economics, and deal structure.' },
    { icon: ICONS.dollar, title: 'Deal structure & terms', desc: 'Minority stakes, governance, returns', prompt: 'Quiz me on growth equity deal structures - minority vs majority stakes, board seats, protective provisions, preferred equity, and how GE returns differ from buyout returns.' },
  ],
  'Real Estate': [
    { icon: ICONS.mail, title: 'Cold email feedback', desc: 'Outreach to REPE professionals', prompt: 'Review my cold email to a real estate PE professional:\n\n[paste your email here]' },
    { icon: ICONS.chat, title: 'Behavioral story prep', desc: 'Why RE? Why REPE?', prompt: 'Help me craft my "Why real estate?" answer for [REPE/REIT/development] roles.' },
    { icon: ICONS.chart, title: 'Technical drill', desc: 'Cap rates, NOI, DSCR, waterfalls', prompt: 'Give me a real estate technical drill. Ask me about cap rates, pro formas, waterfall distributions, and deal metrics.' },
    { icon: ICONS.building, title: 'Deal walkthrough prep', desc: 'Property acquisition analysis', prompt: 'Walk me through how to evaluate an apartment building acquisition. I need to practice the full deal walkthrough.' },
    { icon: ICONS.dollar, title: 'Investment idea prep', desc: 'Market, property type, returns', prompt: 'Help me develop a real estate investment idea with specific numbers - market, property type, cap rate, target IRR.' },
  ],
  'Restructuring': [
    { icon: ICONS.mail, title: 'Cold email feedback', desc: 'Outreach to RX bankers', prompt: 'Review my cold email to a restructuring banker:\n\n[paste your email here]' },
    { icon: ICONS.chat, title: 'Behavioral story prep', desc: 'Why RX? Why not M&A?', prompt: 'Help me craft my "Why restructuring?" answer and explain why I prefer RX over M&A.' },
    { icon: ICONS.chart, title: 'Technical drill', desc: 'Chapter 11, claims, credit analysis', prompt: 'Give me a restructuring technical drill. Ask me about Chapter 11, priority of claims, fulcrum security, DIP financing, and credit metrics.' },
    { icon: ICONS.layers, title: 'Case study prep', desc: 'Distressed situations & bankruptcy', prompt: 'Walk me through a restructuring case study. Give me a distressed company and ask me to analyze the capital structure and propose a solution.' },
    { icon: ICONS.shield, title: 'Distressed situations review', desc: 'Notable bankruptcies & outcomes', prompt: 'Quiz me on notable restructuring cases like Lehman, Hertz, J.Crew, and GM. Test my knowledge of what happened and why.' },
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
  'Growth Equity': 'Mastering unit economics, growth-stage investing, and minority deal structures.',
  'Real Estate': 'Mastering pro forma modeling, cap rates, and REPE deal analysis.',
  'Restructuring': 'Building distressed analysis skills, bankruptcy fluency, and credit expertise.',
};

const QUOTES = [
  { text: '"In this industry, the <em>details</em> aren\'t just details. They are the deal."', attr: ' - Your Coach' },
  { text: '"The best networkers don\'t <em>ask</em> for jobs. They build relationships that <em>lead</em> to them."', attr: ' - Your Coach' },
  { text: '"Every cold email is an <em>audition</em>. Make the first line impossible to ignore."', attr: ' - Your Coach' },
];

const SYSTEM = `You are Coach - an elite finance recruiting advisor. You have deep expertise in investment banking, private equity, hedge funds, consulting, and all aspects of finance recruiting. You help students with cold emails, networking, coffee chats, interview prep, recruiting stories, and offer decisions.

Be direct, specific, and warm - like a brilliant older friend who went through the process. Never give generic advice. When reviewing emails or stories, rewrite them. Remember everything in the conversation and build on it. Keep responses well-formatted with clear paragraphs. Use bullet points when listing multiple things. Always end with a specific follow-up question or next action.`;

type Message = { role: 'user' | 'assistant'; content: string; time?: number };

type StoredConvo = {
  id: string;
  track: string;
  feature: string | null;
  preview: string;
  messages: Message[];
  createdAt: number;
  updatedAt: number;
};

const HISTORY_KEY = 'offerbell_coach_history';
const HISTORY_MAX = 50;

function loadConvos(): StoredConvo[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(HISTORY_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed;
  } catch { return []; }
}

function saveConvos(convos: StoredConvo[]) {
  if (typeof window === 'undefined') return;
  try {
    // Keep newest first, capped at HISTORY_MAX
    const sorted = [...convos].sort((a, b) => b.updatedAt - a.updatedAt).slice(0, HISTORY_MAX);
    localStorage.setItem(HISTORY_KEY, JSON.stringify(sorted));
  } catch {}
}

function newConvoId() {
  return 'c_' + Date.now().toString(36) + '_' + Math.random().toString(36).slice(2, 7);
}

function makePreview(messages: Message[]): string {
  const firstUser = messages.find(m => m.role === 'user');
  if (!firstUser) return 'New conversation';
  const text = firstUser.content.replace(/\s+/g, ' ').trim();
  return text.length > 80 ? text.slice(0, 78).trim() + '...' : text;
}

function timeAgo(ts: number): string {
  const s = Math.floor((Date.now() - ts) / 1000);
  if (s < 60) return 'just now';
  if (s < 3600) return Math.floor(s / 60) + 'm ago';
  if (s < 86400) return Math.floor(s / 3600) + 'h ago';
  const d = Math.floor(s / 86400);
  if (d < 7) return d + 'd ago';
  return new Date(ts).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

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
  // Per-conversation Convex mutations. Replaces the old blob-sync path which
  // pushed the entire offerbell_coach_history (~500KB) on every message.
  const upsertConvoMut = useMutation(api.coachConvos.upsertConvo);
  const importConvosMut = useMutation(api.coachConvos.importConvos);
  const [activeTrack, setActiveTrack] = useState('Investment Banking');
  const [activeFeature, setActiveFeature] = useState<string | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [convos, setConvos] = useState<StoredConvo[]>([]);
  const [activeConvoId, setActiveConvoId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Usage-based limiting - rolling window
  const USAGE_KEY = 'offerbell_coach_pro_usage';
  const MAX_TOKENS = (() => {
    try {
      const plan = localStorage.getItem('offerbell_plan') || 'free';
      if (plan === 'elite') return 80;
      return 40;
    } catch { return 40; }
  })();
  const RESET_HOURS = 8;
  const [usageTokens, setUsageTokens] = useState(0);
  const [usageResetAt, setUsageResetAt] = useState<number>(0);
  const [rateLimited, setRateLimited] = useState(false);

  const getMessageCost = (msgCount: number) => {
    if (msgCount <= 4) return 1;
    if (msgCount <= 10) return 2;
    return 3;
  };

  const loadUsage = () => {
    try {
      const raw = localStorage.getItem(USAGE_KEY);
      if (raw) {
        const data = JSON.parse(raw);
        const now = Date.now();
        if (data.resetAt && now >= data.resetAt) {
          const nextReset = now + RESET_HOURS * 3600000;
          const fresh = { tokens: 0, resetAt: nextReset };
          localStorage.setItem(USAGE_KEY, JSON.stringify(fresh));
          setUsageTokens(0); setUsageResetAt(nextReset); setRateLimited(false);
        } else {
          setUsageTokens(data.tokens || 0);
          setUsageResetAt(data.resetAt || now + RESET_HOURS * 3600000);
          setRateLimited((data.tokens || 0) >= MAX_TOKENS);
        }
        return;
      }
    } catch {}
    const nextReset = Date.now() + RESET_HOURS * 3600000;
    localStorage.setItem(USAGE_KEY, JSON.stringify({ tokens: 0, resetAt: nextReset }));
    setUsageTokens(0); setUsageResetAt(nextReset); setRateLimited(false);
  };

  useEffect(() => { loadUsage(); }, []);

  useEffect(() => {
    const iv = setInterval(() => {
      if (Date.now() >= usageResetAt && usageResetAt > 0) loadUsage();
    }, 30000);
    return () => clearInterval(iv);
  }, [usageResetAt]);

  const usagePct = Math.min(100, Math.round((usageTokens / MAX_TOKENS) * 100));
  const usageWarning = usagePct >= 80;

  const incrementUsage = () => {
    const cost = getMessageCost(messages.length);
    const newTokens = usageTokens + cost;
    const data = { tokens: newTokens, resetAt: usageResetAt || Date.now() + RESET_HOURS * 3600000 };
    localStorage.setItem(USAGE_KEY, JSON.stringify(data));
    setUsageTokens(newTokens);
    if (newTokens >= MAX_TOKENS) setRateLimited(true);
  };

  const formatResetTime = () => {
    if (!usageResetAt) return 'soon';
    const diff = usageResetAt - Date.now();
    if (diff <= 0) return 'any moment now';
    const hours = Math.floor(diff / 3600000);
    const mins = Math.floor((diff % 3600000) / 60000);
    if (hours > 0) return `in ${hours}h ${mins}m`;
    return `in ${mins}m`;
  };
  const [inputVal, setInputVal] = useState('');
  const [userName, setUserName] = useState({ first: '', last: '' });
  const [isPro, setIsPro] = useState(false);
  const [freeLimitHit, setFreeLimitHit] = useState(false);
  // Server-driven limit details (populated from 429 response). When set, the
  // overlay and persistent banner display reset time + plan-specific upgrade
  // CTA. Cleared when the limit window resets.
  const [limitInfo, setLimitInfo] = useState<{ plan: 'free' | 'pro' | 'elite'; used: number; limit: number } | null>(null);
  const [showLimitOverlay, setShowLimitOverlay] = useState(false);
  const [planLoaded, setPlanLoaded] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const saveTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const handleResumeUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    e.target.value = '';

    if (file.type === 'application/pdf' || file.name.endsWith('.pdf')) {
      try {
        // Load pdf.js if not already loaded
        if (!(window as any).pdfjsLib) {
          await new Promise<void>((resolve, reject) => {
            const script = document.createElement('script');
            script.src = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/4.4.168/pdf.min.mjs';
            script.type = 'module';
            script.onload = () => resolve();
            script.onerror = () => reject(new Error('Failed to load PDF parser'));
            document.head.appendChild(script);
          });
          // Fallback: use the global build instead
        }

        // Use FileReader to get array buffer, then parse with a simple approach
        const arrayBuf = await file.arrayBuffer();
        // Extract text from PDF binary using a basic decoder
        const bytes = new Uint8Array(arrayBuf);
        let text = '';
        // Look for text streams in the PDF
        const decoder = new TextDecoder('utf-8', { fatal: false });
        const raw = decoder.decode(bytes);
        // Extract text between BT (begin text) and ET (end text) markers, or parenthesized strings
        const textMatches = raw.match(/\(([^)]{2,})\)/g);
        if (textMatches) {
          text = textMatches
            .map(m => m.slice(1, -1))
            .filter(t => /[a-zA-Z]{2,}/.test(t) && t.length < 200)
            .join(' ')
            .replace(/\\n/g, '\n')
            .replace(/\s+/g, ' ')
            .trim();
        }

        const trimmed = text.slice(0, 3000);
        if (!trimmed || trimmed.length < 50) {
          setInputVal(`I tried to upload my resume PDF but the text couldn't be fully extracted.\n\nPlease paste your resume text below and I'll review it for ${activeTrack} recruiting:\n\n[Paste your resume here]`);
        } else {
          setInputVal(`Here is my resume (note: today's date is ${new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}, so any dates before this are in the past):\n\n${trimmed}\n\nPlease review it and give me specific, actionable feedback for ${activeTrack} recruiting.`);
        }
      } catch (err) {
        console.error('PDF parse error:', err);
        setInputVal(`I tried to upload my resume PDF but the text couldn't be extracted.\n\nPlease paste your resume text below and I'll review it for ${activeTrack} recruiting:\n\n[Paste your resume here]`);
      }
    } else {
      // Plain text files
      const reader = new FileReader();
      reader.onload = () => {
        const text = (reader.result as string).trim().slice(0, 3000);
        if (!text || text.length < 20) {
          setInputVal(`The file couldn't be read properly.\n\nPlease paste your resume text below and I'll review it for ${activeTrack} recruiting:\n\n[Paste your resume here]`);
        } else {
          setInputVal(`Here is my resume (note: today's date is ${new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}, so any dates before this are in the past):\n\n${text}\n\nPlease review it and give me specific, actionable feedback for ${activeTrack} recruiting.`);
        }
      };
      reader.readAsText(file);
    }
    setTimeout(() => textareaRef.current?.focus(), 200);
  };

  const isResumeFeature = activeFeature?.toLowerCase().includes('resume') || false;
  const [quoteIdx] = useState(() => Math.floor(Math.random() * QUOTES.length));

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const init = async () => {
    const stored = window.localStorage.getItem('offerbell_user_id');
    if (!stored) { router.replace('/signin'); return; }
    const plan = window.localStorage.getItem('offerbell_plan') || 'free';
    let profilePlan = 'free';
    try { const prof = JSON.parse(window.localStorage.getItem('offerbell_onboarding_profile') || '{}'); profilePlan = prof.plan || 'free'; } catch {}
    // Check Pro status including cancelled-but-not-expired
    const { isUserPro } = await import('../lib/plan');
    const pro = isUserPro();
    setIsPro(pro);
    setPlanLoaded(true);
    // Check if free user already at limit
    if (!pro) {
      try {
        const now = new Date(); const day = now.getDay(); const diff = day === 0 ? 6 : day - 1;
        const mon = new Date(now); mon.setDate(now.getDate() - diff); mon.setHours(0,0,0,0);
        const week = mon.toISOString().split('T')[0];
        const raw = localStorage.getItem('offerbell_coach_weekly');
        const wk = raw ? JSON.parse(raw) : { week, count: 0 };
        if (wk.week === week && wk.count >= 1) setFreeLimitHit(true);
      } catch {}
    }
    // Load saved conversations. Source of truth is now Convex coachConvos
    // table. We hydrate from there with a one-time migration for users whose
    // history still lives only in localStorage.
    const localList = loadConvos();
    setConvos(localList);

    const convexUrl = process.env.NEXT_PUBLIC_CONVEX_URL?.trim();
    const uid = localStorage.getItem('offerbell_user_id');
    if (convexUrl && uid) {
      (async () => {
        try {
          const client = new ConvexHttpClient(convexUrl);
          const cloud = await client.query(api.coachConvos.listConvos, { userId: uid }) as Array<{ id: string; track: string; feature: string | null; preview: string; messages: string; createdAt: number; updatedAt: number }>;

          // Cloud has data: hydrate from there. Parse messages back from JSON string.
          if (cloud && cloud.length > 0) {
            const cloudConvos: StoredConvo[] = cloud.map(c => ({
              id: c.id,
              track: c.track,
              feature: c.feature,
              preview: c.preview,
              messages: (() => { try { return JSON.parse(c.messages); } catch { return []; } })(),
              createdAt: c.createdAt,
              updatedAt: c.updatedAt,
            }));
            // Merge with local-only convos (anything in localStorage not yet uploaded)
            const cloudIds = new Set(cloudConvos.map(c => c.id));
            const onlyLocal = localList.filter(c => !cloudIds.has(c.id));
            const merged = [...cloudConvos, ...onlyLocal].sort((a, b) => b.updatedAt - a.updatedAt);
            setConvos(merged);
            saveConvos(merged);
            // Push any local-only to cloud
            if (onlyLocal.length > 0) {
              try {
                await importConvosMut({
                  userId: uid,
                  convos: onlyLocal.map(c => ({
                    convoId: c.id,
                    track: c.track,
                    feature: c.feature ?? undefined,
                    preview: c.preview,
                    messages: JSON.stringify(c.messages),
                    createdAt: c.createdAt,
                    updatedAt: c.updatedAt,
                  })),
                });
              } catch {}
            }
          } else if (localList.length > 0) {
            // Cloud empty, local has data: migrate up
            try {
              await importConvosMut({
                userId: uid,
                convos: localList.map(c => ({
                  convoId: c.id,
                  track: c.track,
                  feature: c.feature ?? undefined,
                  preview: c.preview,
                  messages: JSON.stringify(c.messages),
                  createdAt: c.createdAt,
                  updatedAt: c.updatedAt,
                })),
              });
            } catch {}
          }
        } catch {
          // Network failure - keep showing localStorage data
        }
      })();
    }
    // Use saved theme preference
    const savedTheme = localStorage.getItem('offerbell-theme');
    if (savedTheme) document.documentElement.setAttribute('data-theme', savedTheme);
    try {
      const raw = localStorage.getItem('offerbell_onboarding_profile');
      if (raw) { const p = JSON.parse(raw); setUserName({ first: p.firstName || '', last: p.lastName || '' }); }
    } catch {}
    };
    init();
  }, [router]);

  const scrollBottom = useCallback(() => {
    setTimeout(() => messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' }), 50);
  }, []);

  // Auto-save the active conversation whenever messages change
  useEffect(() => {
    if (!planLoaded) return;
    if (messages.length === 0) return;
    if (saveTimerRef.current) clearTimeout(saveTimerRef.current);
    saveTimerRef.current = setTimeout(() => {
      const id = activeConvoId || newConvoId();
      const now = Date.now();
      setConvos(prev => {
        const existing = prev.find(c => c.id === id);
        const updated: StoredConvo = existing
          ? { ...existing, messages, preview: makePreview(messages), updatedAt: now, track: activeTrack, feature: activeFeature }
          : { id, track: activeTrack, feature: activeFeature, preview: makePreview(messages), messages, createdAt: now, updatedAt: now };
        const others = prev.filter(c => c.id !== id);
        const next = [updated, ...others];
        saveConvos(next);

        // Push this single convo to Convex (per-row, not the entire blob).
        const uid = localStorage.getItem('offerbell_user_id');
        if (uid) {
          upsertConvoMut({
            userId: uid,
            convoId: updated.id,
            track: updated.track,
            feature: updated.feature ?? undefined,
            preview: updated.preview,
            messages: JSON.stringify(updated.messages),
            createdAt: updated.createdAt,
            updatedAt: updated.updatedAt,
          }).catch(() => {});
        }

        return next;
      });
      if (!activeConvoId) setActiveConvoId(id);
    }, 350);
    return () => {
      if (saveTimerRef.current) clearTimeout(saveTimerRef.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [messages, planLoaded]);

  const loadConvo = (c: StoredConvo) => {
    setActiveTrack(c.track);
    setActiveFeature(c.feature);
    setMessages(c.messages);
    setActiveConvoId(c.id);
    setInputVal('');
    scrollBottom();
  };

  const newConversation = () => {
    setMessages([]);
    setInputVal('');
    setActiveConvoId(null);
    setActiveFeature(null);
    setTimeout(() => textareaRef.current?.focus(), 100);
  };

  const deleteConvoMut = useMutation(api.coachConvos.deleteConvo);
  const deleteConvo = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setConvos(prev => {
      const next = prev.filter(c => c.id !== id);
      saveConvos(next);
      return next;
    });
    const uid = localStorage.getItem('offerbell_user_id');
    if (uid) {
      deleteConvoMut({ userId: uid, convoId: id }).catch(() => {});
    }
    if (id === activeConvoId) {
      setMessages([]);
      setActiveConvoId(null);
      setActiveFeature(null);
    }
  };

  // Returns next Monday 00:00 in user's local time. Server's weekly window is
  // UTC Monday-to-Monday, so we convert from UTC to local for display.
  const getNextResetDate = (): Date => {
    const now = new Date();
    // Find Monday UTC of NEXT week
    const utcDay = now.getUTCDay();
    const daysUntilNextMonday = utcDay === 0 ? 1 : (8 - utcDay);
    const nextMondayUTC = new Date(Date.UTC(
      now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate() + daysUntilNextMonday, 0, 0, 0, 0
    ));
    return nextMondayUTC;
  };

  const getWeeklyResetDisplay = (): { day: string; time: string; relative: string } => {
    const reset = getNextResetDate();
    const day = reset.toLocaleDateString(undefined, { weekday: 'long', month: 'short', day: 'numeric' });
    const time = reset.toLocaleTimeString(undefined, { hour: 'numeric', minute: '2-digit' });
    const diff = reset.getTime() - Date.now();
    const days = Math.floor(diff / 86400000);
    const hours = Math.floor((diff % 86400000) / 3600000);
    let relative: string;
    if (days >= 1) relative = `in ${days}d ${hours}h`;
    else if (hours >= 1) relative = `in ${hours}h`;
    else relative = `in ${Math.floor(diff / 60000)}m`;
    return { day, time, relative };
  };

  const sendMessage = async (text: string) => {
    if (isLoading || !text.trim()) return;
    if (isPro && rateLimited) return;
    // Server is the source of truth. If we know the limit's hit, block here
    // instead of making a network round trip just to get a 429 back.
    if (limitInfo) {
      setShowLimitOverlay(true);
      return;
    }

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
        // Server-side limit reached. Strip the user's just-sent message from
        // the chat (it never got processed) and surface the limit screen
        // instead of dumping "limit_reached" into a Coach bubble.
        if (res.status === 429 && data?.error === 'limit_reached') {
          setMessages(prev => prev.slice(0, -1));
          setLimitInfo({
            plan: (data.plan as 'free' | 'pro' | 'elite') || (isPro ? 'pro' : 'free'),
            used: typeof data.used === 'number' ? data.used : 0,
            limit: typeof data.limit === 'number' ? data.limit : 1,
          });
          setShowLimitOverlay(true);
        } else {
          setMessages(prev => [...prev, { role: 'assistant', content: ' ' + (data.error || 'Coach is temporarily unavailable.'), time: Date.now() }]);
        }
      } else {
        setMessages(prev => [...prev, { role: 'assistant', content: data.text || 'Something went wrong.', time: Date.now() }]);
        if (isPro) {
          incrementUsage();
        }
        // Free / Pro / Elite usage is now tracked server-side in Convex.
        // No more localStorage counting.
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
    setActiveFeature(title);
    // Look for an existing recent convo on this track + feature
    const match = convos.find(c => c.track === activeTrack && c.feature === title);
    if (match) {
      loadConvo(match);
    } else {
      setMessages([]);
      setActiveConvoId(null);
      setInputVal(prompt);
    }
    setTimeout(() => textareaRef.current?.focus(), 100);
  };

  const features = TRACK_FEATURES[activeTrack] || TRACK_FEATURES['Investment Banking'];
  const displayName = userName.first || 'there';

  // Show nothing until plan status is confirmed
  if (!planLoaded) return (
    <div className="app">
      <Sidebar activePage="coach" />
      <div className="coach-main" />
    </div>
  );

  // Free users can access coach but with weekly limit (enforced in sendMessage)

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
              setActiveTrack(e.target.value);
              setActiveFeature(null);
              setMessages([]);
              setActiveConvoId(null);
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

          {convos.length > 0 && (
            <div className="coach-history">
              <div className="coach-history-head">
                <div className="coach-left-section" style={{ marginBottom: 0 }}>Recent</div>
                {messages.length > 0 && (
                  <button className="coach-history-new" onClick={newConversation} type="button" title="Start a new conversation">
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><path d="M12 5v14M5 12h14"/></svg>
                    New
                  </button>
                )}
              </div>
              <div className="coach-history-list">
                {convos.slice(0, 8).map(c => {
                  const isActive = c.id === activeConvoId;
                  return (
                    <div
                      key={c.id}
                      className={`coach-history-item${isActive ? ' active' : ''}`}
                      onClick={() => loadConvo(c)}
                    >
                      <div className="coach-history-item-main">
                        <div className="coach-history-item-meta">
                          <span className="coach-history-item-track">{c.track}</span>
                          {c.feature && <span className="coach-history-item-feature"> · {c.feature}</span>}
                        </div>
                        <div className="coach-history-item-preview">{c.preview}</div>
                        <div className="coach-history-item-time">{timeAgo(c.updatedAt)}</div>
                      </div>
                      <button
                        className="coach-history-item-delete"
                        onClick={e => deleteConvo(c.id, e)}
                        type="button"
                        title="Delete conversation"
                        aria-label="Delete conversation"
                      >
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M18 6 6 18M6 6l12 12"/></svg>
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

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

          {isPro && rateLimited ? (
            <div style={{ padding: '24px 20px', borderTop: '1px solid var(--border)', textAlign: 'center' }}>
              <div style={{ maxWidth: 420, margin: '0 auto' }}>
                <div style={{ fontSize: 15, fontWeight: 700, color: 'var(--text)', marginBottom: 6, fontFamily: "'Instrument Serif', serif" }}>You've hit your limit for this session</div>
                <div style={{ fontSize: 13, color: 'var(--text-3)', lineHeight: 1.6 }}>
                  Your usage resets <strong style={{ color: 'var(--text)' }}>{formatResetTime()}</strong>. You'll be able to continue your conversation then.
                </div>
                <div style={{ fontSize: 11, color: 'var(--text-3)', marginTop: 14 }}>
                  Keep prepping: <a href="/flashcards" style={{ color: 'var(--text)', fontWeight: 700, textDecoration: 'underline' }}>Flashcards</a> · <a href="/concept-drills" style={{ color: 'var(--text)', fontWeight: 700, textDecoration: 'underline' }}>Concept Drills</a> · <a href="/diagnostic-review" style={{ color: 'var(--text)', fontWeight: 700, textDecoration: 'underline' }}>Diagnostic Review</a>
                  {typeof window !== 'undefined' && localStorage.getItem('offerbell_plan') !== 'elite' && <> · <a href="/checkout" style={{ color: '#2563eb', fontWeight: 700, textDecoration: 'underline' }}>Upgrade to Elite</a> for higher limits</>}
                </div>
              </div>
            </div>
          ) : (
          <div className="coach-input-area">
            <div className="coach-input-area-inner">
              {limitInfo && (
                <div style={{
                  display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12,
                  padding: '12px 16px', marginBottom: 10,
                  background: 'var(--surface-2)', border: '1.5px solid var(--border)', borderRadius: 10,
                  fontSize: 12.5, color: 'var(--text-2)',
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <svg width="15" height="15" fill="none" stroke="var(--text-3)" strokeWidth="1.6" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
                    <span>
                      <strong style={{ color: 'var(--text)' }}>Coach limit reached.</strong>{' '}
                      Resets <strong style={{ color: 'var(--text)' }}>{getWeeklyResetDisplay().day}</strong> ({getWeeklyResetDisplay().relative}).
                    </span>
                  </div>
                  {limitInfo.plan !== 'elite' && (
                    <a href="/checkout" style={{
                      padding: '6px 12px', borderRadius: 6,
                      background: 'var(--text)', color: 'var(--surface)',
                      fontSize: 11.5, fontWeight: 700, textDecoration: 'none',
                      fontFamily: "'Sora', sans-serif", whiteSpace: 'nowrap',
                    }}>Upgrade</a>
                  )}
                </div>
              )}
              {isPro && usageWarning && !rateLimited && !limitInfo && (
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '8px 14px', marginBottom: 8, background: '#fef3c7', border: '1px solid #fde68a', borderRadius: 8, fontSize: 12, color: '#92400e' }}>
                  <svg width="14" height="14" fill="none" stroke="#d97706" strokeWidth="2" viewBox="0 0 24 24"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>
                  <span>You've used about <strong>{usagePct}%</strong> of your session limit. Resets {formatResetTime()}.</span>
                </div>
              )}
              {activeFeature && (
                <div className="coach-context-label">Context: {activeTrack} - {activeFeature}</div>
              )}
              <div className="coach-input-box">
                <input type="file" ref={fileInputRef} accept=".txt,.pdf" onChange={handleResumeUpload} style={{ display: 'none' }} />
                {isResumeFeature && (
                <button className="coach-upload-btn" onClick={() => fileInputRef.current?.click()} type="button" title="Upload resume (PDF or TXT)" style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-3)', padding: '6px', display: 'flex', alignItems: 'center', flexShrink: 0 }}>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21.44 11.05l-9.19 9.19a6 6 0 0 1-8.49-8.49l9.19-9.19a4 4 0 0 1 5.66 5.66l-9.2 9.19a2 2 0 0 1-2.83-2.83l8.49-8.48"/></svg>
                </button>
                )}
                <textarea
                  ref={textareaRef}
                  className="coach-chat-input"
                  placeholder={limitInfo ? `Limit reached. Resets ${getWeeklyResetDisplay().day}.` : "Type your strategic response..."}
                  rows={1}
                  value={inputVal}
                  onChange={e => { setInputVal(e.target.value); autoResize(e.target); }}
                  onKeyDown={handleKey}
                  disabled={!!limitInfo}
                  style={limitInfo ? { opacity: 0.4, cursor: 'not-allowed' } : undefined}
                />
                <button className="coach-send-btn" onClick={() => sendMessage(inputVal)} disabled={isLoading || !inputVal.trim() || !!limitInfo} type="button">
                  {isLoading ? <div className="coach-spinner" /> : <svg width="16" height="16" fill="none" viewBox="0 0 24 24"><path d="M5 12h14M12 5l7 7-7 7" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/></svg>}
                </button>
              </div>
              <div className="coach-input-footer">{isResumeFeature ? 'Upload your resume with the clip icon, or paste the text directly.' : 'Ask anything about your recruiting process.'}</div>
            </div>
          </div>
          )}
        </div>
      </div>

      {/* Usage limit overlay (all plans). Server-driven via limitInfo. */}
      {showLimitOverlay && limitInfo && (() => {
        const reset = getWeeklyResetDisplay();
        const planLabel = limitInfo.plan === 'free' ? 'Free' : limitInfo.plan === 'pro' ? 'Pro' : 'Elite';
        const nextTier = limitInfo.plan === 'free' ? 'Pro' : limitInfo.plan === 'pro' ? 'Elite' : null;
        return (
        <div style={{
          position: 'fixed', inset: 0, zIndex: 400,
          background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(12px)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          animation: 'fadeIn 0.25s ease', padding: 20,
        }}>
          <div style={{
            background: 'var(--surface)', border: '1.5px solid var(--border)',
            borderRadius: 20, padding: '44px 40px', maxWidth: 440, width: '100%',
            textAlign: 'center', boxShadow: '0 24px 80px rgba(0,0,0,0.2)',
          }}>
            <div style={{
              width: 56, height: 56, borderRadius: '50%', background: 'var(--surface-2)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              margin: '0 auto 20px',
            }}>
              <svg width="24" height="24" fill="none" stroke="var(--text-3)" strokeWidth="1.5" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
            </div>
            <div style={{ fontFamily: "'Instrument Serif', serif", fontSize: 28, color: 'var(--text)', letterSpacing: '-0.5px', marginBottom: 10 }}>
              Usage limit <em style={{ fontStyle: 'italic' }}>reached</em>
            </div>
            <div style={{ fontSize: 13.5, color: 'var(--text-2)', lineHeight: 1.65, marginBottom: 8 }}>
              You've used all <strong style={{ color: 'var(--text)' }}>{limitInfo.limit}</strong> of your weekly Coach messages on the {planLabel} plan.
            </div>
            <div style={{ fontSize: 13, color: 'var(--text-3)', lineHeight: 1.65, marginBottom: 26 }}>
              Resets <strong style={{ color: 'var(--text)' }}>{reset.day}</strong> at <strong style={{ color: 'var(--text)' }}>{reset.time}</strong> ({reset.relative}).
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {nextTier && (
                <a href="/checkout" style={{
                  display: 'block', padding: '13px 0', borderRadius: 10,
                  background: 'var(--text)', color: 'var(--surface)',
                  fontSize: 14, fontWeight: 700, textDecoration: 'none',
                  fontFamily: "'Sora', sans-serif",
                }}>Upgrade to {nextTier} for higher limits</a>
              )}
              <button onClick={() => setShowLimitOverlay(false)} type="button" style={{
                padding: '12px 0', borderRadius: 10,
                background: 'none', border: '1.5px solid var(--border)',
                color: 'var(--text-2)', fontSize: 13, fontWeight: 600,
                cursor: 'pointer', fontFamily: "'Sora', sans-serif",
              }}>Got it</button>
            </div>
          </div>
        </div>
        );
      })()}
      <style>{`@keyframes fadeIn{from{opacity:0}to{opacity:1}}`}</style>
    </div>
  );
}
