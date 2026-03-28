'use client';

import Sidebar from "../components/Sidebar";
import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import '../contact-finder/contact-finder.css';

const ALL_FIRMS = [
  { logo:'GS', color:'#0c0c0c', name:'Goldman Sachs', rate:62, days:'1.8d', angle:'Alumni', tier:'green' },
  { logo:'JPM', color:'#003087', name:'J.P. Morgan', rate:54, days:'2.4d', angle:'Alumni', tier:'green' },
  { logo:'MS', color:'#003580', name:'Morgan Stanley', rate:41, days:'3.0d', angle:'Shared Interest', tier:'amber' },
  { logo:'BAR', color:'#00aeef', name:'Barclays', rate:38, days:'3.2d', angle:'Alumni', tier:'amber' },
  { logo:'C', color:'#003b7a', name:'Citi', rate:36, days:'3.3d', angle:'Alumni', tier:'amber' },
  { logo:'BAM', color:'#c00000', name:'Bank of America', rate:35, days:'3.4d', angle:'Alumni', tier:'amber' },
  { logo:'UBS', color:'#e60000', name:'UBS', rate:33, days:'3.6d', angle:'Alumni', tier:'amber' },
  { logo:'DB', color:'#0018a8', name:'Deutsche Bank', rate:31, days:'3.8d', angle:'Deal Reference', tier:'amber' },
  { logo:'WF', color:'#d71e28', name:'Wells Fargo', rate:29, days:'4.0d', angle:'Alumni', tier:'amber' },
  { logo:'CS', color:'#003b7a', name:'Credit Suisse', rate:28, days:'4.1d', angle:'Alumni', tier:'amber' },
  { logo:'HS', color:'#db0011', name:'HSBC', rate:27, days:'4.3d', angle:'Alumni', tier:'amber' },
  { logo:'BNP', color:'#006b3f', name:'BNP Paribas', rate:28, days:'4.2d', angle:'Alumni', tier:'amber' },
  { logo:'SG', color:'#e2001a', name:'Societe Generale', rate:26, days:'4.4d', angle:'Alumni', tier:'amber' },
  { logo:'NOM', color:'#8B0000', name:'Nomura', rate:25, days:'4.5d', angle:'Deal Reference', tier:'red' },
  { logo:'MAC', color:'#ffb400', name:'Macquarie', rate:30, days:'3.9d', angle:'Deal Reference', tier:'amber' },
  { logo:'RBC', color:'#005daa', name:'RBC Capital Markets', rate:32, days:'3.7d', angle:'Alumni', tier:'amber' },
  { logo:'EV', color:'#8B0000', name:'Evercore', rate:58, days:'2.1d', angle:'Deal Reference', tier:'green' },
  { logo:'LAZ', color:'#2d3748', name:'Lazard', rate:35, days:'3.1d', angle:'Alumni', tier:'amber' },
  { logo:'CV', color:'#1a1a2e', name:'Centerview Partners', rate:33, days:'3.3d', angle:'Alumni', tier:'amber' },
  { logo:'PJT', color:'#2c3e50', name:'PJT Partners', rate:31, days:'3.5d', angle:'Deal Reference', tier:'amber' },
  { logo:'MOE', color:'#1e3a5f', name:'Moelis', rate:29, days:'3.8d', angle:'Alumni', tier:'amber' },
  { logo:'GUG', color:'#1e3a5f', name:'Guggenheim Partners', rate:28, days:'4.0d', angle:'Deal Reference', tier:'amber' },
  { logo:'HL', color:'#702459', name:'Houlihan Lokey', rate:34, days:'3.2d', angle:'Alumni', tier:'amber' },
  { logo:'PWP', color:'#2c3e50', name:'Perella Weinberg Partners', rate:27, days:'4.1d', angle:'Deal Reference', tier:'amber' },
  { logo:'RC', color:'#8B0000', name:'Rothschild & Co', rate:26, days:'4.3d', angle:'Alumni', tier:'amber' },
  { logo:'DUC', color:'#1a1a2e', name:'Ducera Partners', rate:24, days:'4.7d', angle:'Alumni', tier:'red' },
  { logo:'WB', color:'#1a365d', name:'William Blair', rate:36, days:'3.1d', angle:'Alumni', tier:'amber' },
  { logo:'RJ', color:'#003087', name:'Raymond James', rate:34, days:'3.3d', angle:'Alumni', tier:'amber' },
  { logo:'JEF', color:'#2b2d42', name:'Jefferies', rate:32, days:'3.6d', angle:'Alumni', tier:'amber' },
  { logo:'COW', color:'#1a1a2e', name:'Cowen', rate:28, days:'4.0d', angle:'Alumni', tier:'amber' },
  { logo:'STI', color:'#1a1a2e', name:'Stifel', rate:28, days:'4.0d', angle:'Alumni', tier:'amber' },
  { logo:'PS', color:'#003d6b', name:'Piper Sandler', rate:33, days:'3.4d', angle:'Alumni', tier:'amber' },
  { logo:'CAN', color:'#1a1a2e', name:'Canaccord Genuity', rate:26, days:'4.4d', angle:'Alumni', tier:'amber' },
  { logo:'LI', color:'#1a365d', name:'Lincoln International', rate:30, days:'3.8d', angle:'Alumni', tier:'amber' },
  { logo:'HW', color:'#2d3748', name:'Harris Williams', rate:31, days:'3.7d', angle:'Deal Reference', tier:'amber' },
  { logo:'BAI', color:'#003399', name:'Robert W. Baird', rate:37, days:'3.0d', angle:'Alumni', tier:'amber' },
  { logo:'STE', color:'#1a1a2e', name:'Stephens Inc.', rate:27, days:'4.2d', angle:'Alumni', tier:'amber' },
  { logo:'KEY', color:'#1a1a2e', name:'KeyBanc Capital Markets', rate:28, days:'4.1d', angle:'Alumni', tier:'amber' },
  { logo:'BMO', color:'#0075be', name:'BMO Capital Markets', rate:29, days:'4.0d', angle:'Alumni', tier:'amber' },
  { logo:'TRU', color:'#6b2d8b', name:'Truist Securities', rate:27, days:'4.2d', angle:'Alumni', tier:'amber' },
  { logo:'OPP', color:'#1a1a2e', name:'Oppenheimer', rate:27, days:'4.2d', angle:'Alumni', tier:'amber' },
  { logo:'IMP', color:'#1a1a2e', name:'Imperial Capital', rate:24, days:'4.7d', angle:'Alumni', tier:'red' },
  { logo:'D&P', color:'#1a1a2e', name:'Duff & Phelps', rate:26, days:'4.4d', angle:'Alumni', tier:'amber' },
  { logo:'FTI', color:'#1a1a2e', name:'FTI Consulting', rate:25, days:'4.5d', angle:'Deal Reference', tier:'red' },
  { logo:'BGL', color:'#1a1a2e', name:'BGL (Brown Gibbons Lang)', rate:25, days:'4.5d', angle:'Alumni', tier:'red' },
  { logo:'BAI', color:'#003399', name:'Baird', rate:37, days:'3.0d', angle:'Alumni', tier:'amber' },
  { logo:'WED', color:'#1a1a2e', name:'Wedbush Securities', rate:24, days:'4.7d', angle:'Alumni', tier:'red' },
  { logo:'DAD', color:'#1a1a2e', name:'D.A. Davidson', rate:25, days:'4.5d', angle:'Alumni', tier:'red' },
  { logo:'JAN', color:'#1a1a2e', name:'Janney Montgomery Scott', rate:24, days:'4.6d', angle:'Alumni', tier:'red' },
  { logo:'NEE', color:'#1a1a2e', name:'Needham & Company', rate:24, days:'4.7d', angle:'Alumni', tier:'red' },
  { logo:'BRI', color:'#1a1a2e', name:'B. Riley Securities', rate:23, days:'4.8d', angle:'Alumni', tier:'red' },
  { logo:'ROT', color:'#1a1a2e', name:'Roth Capital Partners', rate:22, days:'5.0d', angle:'Alumni', tier:'red' },
  { logo:'BX', color:'#1a1a1a', name:'Blackstone', rate:22, days:'5.1d', angle:'Deal Reference', tier:'red' },
  { logo:'KKR', color:'#2c5282', name:'KKR', rate:22, days:'5.2d', angle:'Mutual Connection', tier:'red' },
  { logo:'APO', color:'#1a202c', name:'Apollo Global Management', rate:20, days:'5.5d', angle:'Deal Reference', tier:'red' },
  { logo:'CG', color:'#1e3a5f', name:'Carlyle', rate:19, days:'5.8d', angle:'Deal Reference', tier:'red' },
  { logo:'ARES', color:'#1e3a5f', name:'Ares Management', rate:23, days:'5.0d', angle:'Alumni', tier:'red' },
  { logo:'TPG', color:'#553c9a', name:'TPG', rate:21, days:'5.3d', angle:'Deal Reference', tier:'red' },
  { logo:'TB', color:'#553c9a', name:'Thoma Bravo', rate:20, days:'5.6d', angle:'Deal Reference', tier:'red' },
  { logo:'VIS', color:'#1a1a2e', name:'Vista Equity', rate:19, days:'5.7d', angle:'Deal Reference', tier:'red' },
  { logo:'ADV', color:'#1a1a2e', name:'Advent International', rate:18, days:'6.0d', angle:'Deal Reference', tier:'red' },
  { logo:'H&F', color:'#1a1a2e', name:'Hellman & Friedman', rate:18, days:'6.1d', angle:'Deal Reference', tier:'red' },
  { logo:'SL', color:'#1a1a2e', name:'Silver Lake', rate:19, days:'5.9d', angle:'Deal Reference', tier:'red' },
  { logo:'GA', color:'#1e3a5f', name:'General Atlantic', rate:24, days:'4.8d', angle:'Deal Reference', tier:'red' },
  { logo:'WP', color:'#1e3a5f', name:'Warburg Pincus', rate:22, days:'5.1d', angle:'Deal Reference', tier:'red' },
  { logo:'EQT', color:'#1a1a2e', name:'EQT', rate:18, days:'6.0d', angle:'Deal Reference', tier:'red' },
  { logo:'CVC', color:'#1a1a2e', name:'CVC Capital', rate:17, days:'6.3d', angle:'Deal Reference', tier:'red' },
  { logo:'CIN', color:'#1a1a2e', name:'Cinven', rate:17, days:'6.4d', angle:'Deal Reference', tier:'red' },
  { logo:'PER', color:'#1a1a2e', name:'Permira', rate:17, days:'6.4d', angle:'Deal Reference', tier:'red' },
  { logo:'CD&R', color:'#1a1a2e', name:'Clayton Dubilier & Rice', rate:18, days:'6.2d', angle:'Deal Reference', tier:'red' },
  { logo:'INS', color:'#553c9a', name:'Insight Partners', rate:23, days:'5.0d', angle:'Shared Interest', tier:'red' },
  { logo:'TIG', color:'#1a1a2e', name:'Tiger Global', rate:16, days:'6.5d', angle:'Shared Interest', tier:'red' },
  { logo:'FP', color:'#553c9a', name:'Francisco Partners', rate:21, days:'5.3d', angle:'Deal Reference', tier:'red' },
  { logo:'SUM', color:'#1a1a2e', name:'Summit Partners', rate:20, days:'5.5d', angle:'Alumni', tier:'red' },
  { logo:'BC', color:'#8B0000', name:'Bain Capital', rate:21, days:'5.4d', angle:'Alumni', tier:'red' },
  { logo:'LGP', color:'#1a1a2e', name:'Leonard Green & Partners', rate:19, days:'5.8d', angle:'Deal Reference', tier:'red' },
  { logo:'AS', color:'#1a1a2e', name:'American Securities', rate:18, days:'6.0d', angle:'Alumni', tier:'red' },
  { logo:'BP', color:'#1a1a2e', name:'Berkshire Partners', rate:19, days:'5.9d', angle:'Alumni', tier:'red' },
  { logo:'TA', color:'#1a1a2e', name:'TA Associates', rate:20, days:'5.6d', angle:'Alumni', tier:'red' },
  { logo:'GHP', color:'#1a1a2e', name:'Great Hill Partners', rate:19, days:'5.8d', angle:'Alumni', tier:'red' },
  { logo:'GTC', color:'#1a1a2e', name:'GTCR', rate:18, days:'6.0d', angle:'Alumni', tier:'red' },
  { logo:'AUD', color:'#1a1a2e', name:'Audax Private Equity', rate:17, days:'6.3d', angle:'Alumni', tier:'red' },
  { logo:'GEN', color:'#1a1a2e', name:'Genstar Capital', rate:17, days:'6.4d', angle:'Alumni', tier:'red' },
  { logo:'WC', color:'#1a1a2e', name:'Welsh Carson', rate:18, days:'6.2d', angle:'Alumni', tier:'red' },
  { logo:'NMC', color:'#1a1a2e', name:'New Mountain Capital', rate:19, days:'5.9d', angle:'Alumni', tier:'red' },
  { logo:'VER', color:'#1a1a2e', name:'Veritas Capital', rate:17, days:'6.4d', angle:'Deal Reference', tier:'red' },
  { logo:'AKK', color:'#1a1a2e', name:'Accel-KKR', rate:16, days:'6.6d', angle:'Deal Reference', tier:'red' },
  { logo:'MAR', color:'#1a1a2e', name:'Marlin Equity', rate:16, days:'6.5d', angle:'Deal Reference', tier:'red' },
  { logo:'TS', color:'#553c9a', name:'Two Sigma', rate:16, days:'6.4d', angle:'Shared Interest', tier:'red' },
  { logo:'DES', color:'#2c3e50', name:'D.E. Shaw', rate:12, days:'7.5d', angle:'Shared Interest', tier:'red' },
  { logo:'CIT', color:'#1a365d', name:'Citadel', rate:14, days:'7.0d', angle:'Shared Interest', tier:'red' },
  { logo:'CS', color:'#1a365d', name:'Citadel Securities', rate:13, days:'7.2d', angle:'Shared Interest', tier:'red' },
  { logo:'JS', color:'#2d6a4f', name:'Jane Street', rate:18, days:'6.1d', angle:'Shared Interest', tier:'red' },
  { logo:'HRT', color:'#1e3a5f', name:'Hudson River Trading', rate:15, days:'6.8d', angle:'Shared Interest', tier:'red' },
  { logo:'VIR', color:'#0066cc', name:'Virtu Financial', rate:19, days:'5.7d', angle:'Shared Interest', tier:'red' },
  { logo:'REN', color:'#1a1a2e', name:'Renaissance Technologies', rate:10, days:'8.5d', angle:'Shared Interest', tier:'red' },
  { logo:'JMP', color:'#1a1a2e', name:'Jump Trading', rate:13, days:'7.3d', angle:'Shared Interest', tier:'red' },
  { logo:'P72', color:'#003366', name:'Point72', rate:24, days:'4.8d', angle:'Shared Interest', tier:'red' },
  { logo:'MIL', color:'#1a1a2e', name:'Millennium Management', rate:17, days:'6.3d', angle:'Shared Interest', tier:'red' },
  { logo:'AQR', color:'#1a1a2e', name:'AQR Capital', rate:21, days:'5.4d', angle:'Shared Interest', tier:'red' },
  { logo:'BW', color:'#1a1a2e', name:'Bridgewater Associates', rate:11, days:'8.0d', angle:'Shared Interest', tier:'red' },
  { logo:'MAN', color:'#1a1a2e', name:'Man Group', rate:15, days:'6.7d', angle:'Shared Interest', tier:'red' },
  { logo:'WIN', color:'#1a1a2e', name:'Winton Group', rate:13, days:'7.4d', angle:'Shared Interest', tier:'red' },
  { logo:'ELL', color:'#1a1a2e', name:'Elliott Management', rate:14, days:'7.1d', angle:'Shared Interest', tier:'red' },
  { logo:'BAU', color:'#1a1a2e', name:'Baupost Group', rate:12, days:'7.8d', angle:'Shared Interest', tier:'red' },
  { logo:'LPC', color:'#1a1a2e', name:'Lone Pine Capital', rate:13, days:'7.5d', angle:'Shared Interest', tier:'red' },
  { logo:'TGM', color:'#1a1a2e', name:'Tiger Management', rate:12, days:'7.7d', angle:'Shared Interest', tier:'red' },
  { logo:'VIK', color:'#1a1a2e', name:'Viking Global', rate:14, days:'7.2d', angle:'Shared Interest', tier:'red' },
  { logo:'3PT', color:'#1a1a2e', name:'Third Point', rate:15, days:'6.9d', angle:'Shared Interest', tier:'red' },
  { logo:'PSQ', color:'#1a1a2e', name:'Pershing Square', rate:16, days:'6.6d', angle:'Shared Interest', tier:'red' },
  { logo:'GLC', color:'#1a1a2e', name:'Greenlight Capital', rate:13, days:'7.4d', angle:'Shared Interest', tier:'red' },
  { logo:'BLK', color:'#1a1a2e', name:'BlackRock', rate:36, days:'3.0d', angle:'Alumni', tier:'amber' },
  { logo:'FID', color:'#1b5e20', name:'Fidelity', rate:31, days:'3.6d', angle:'Alumni', tier:'amber' },
  { logo:'TR', color:'#0d47a1', name:'T. Rowe Price', rate:29, days:'3.9d', angle:'Alumni', tier:'amber' },
  { logo:'MCK', color:'#1b1b1b', name:'McKinsey & Company', rate:45, days:'2.6d', angle:'Alumni', tier:'green' },
  { logo:'BCG', color:'#006400', name:'Boston Consulting Group', rate:43, days:'2.7d', angle:'Alumni', tier:'green' },
  { logo:'BAIN', color:'#8B0000', name:'Bain & Company', rate:40, days:'2.9d', angle:'Alumni', tier:'amber' },
  { logo:'DEL', color:'#86bc25', name:'Deloitte', rate:38, days:'3.1d', angle:'Alumni', tier:'amber' },
  { logo:'EY', color:'#ffe600', name:'EY', rate:36, days:'3.2d', angle:'Alumni', tier:'amber' },
  { logo:'PWC', color:'#d04a02', name:'PwC', rate:35, days:'3.3d', angle:'Alumni', tier:'amber' },
  { logo:'KP', color:'#00338d', name:'KPMG', rate:32, days:'3.5d', angle:'Alumni', tier:'amber' },
  { logo:'LEK', color:'#003087', name:'LEK', rate:34, days:'3.3d', angle:'Alumni', tier:'amber' },
  { logo:'OW', color:'#e2001a', name:'Oliver Wyman', rate:37, days:'3.0d', angle:'Alumni', tier:'amber' },
  { logo:'STR', color:'#d04a02', name:'Strategy&', rate:33, days:'3.4d', angle:'Alumni', tier:'amber' },
  { logo:'ACC', color:'#a100ff', name:'Accenture', rate:35, days:'3.2d', angle:'Alumni', tier:'amber' },
  { logo:'AM', color:'#1a1a2e', name:'Alvarez & Marsal', rate:33, days:'3.4d', angle:'Deal Reference', tier:'amber' },
  { logo:'HUR', color:'#0066cc', name:'Huron Consulting', rate:30, days:'3.8d', angle:'Alumni', tier:'amber' },
  { logo:'WM', color:'#003087', name:'West Monroe Partners', rate:36, days:'3.1d', angle:'Alumni', tier:'amber' },
  { logo:'KE', color:'#1a1a2e', name:'Kearney', rate:31, days:'3.7d', angle:'Alumni', tier:'amber' },
  { logo:'RB', color:'#1a1a2e', name:'Roland Berger', rate:28, days:'4.1d', angle:'Alumni', tier:'amber' },
  { logo:'ZS', color:'#1a1a2e', name:'ZS Associates', rate:29, days:'4.0d', angle:'Alumni', tier:'amber' },
  { logo:'PUT', color:'#1a1a2e', name:'Putnam Associates', rate:27, days:'4.2d', angle:'Alumni', tier:'amber' },
];

const DEFAULT_FIRMS = new Set(['Goldman Sachs','Evercore','J.P. Morgan','Morgan Stanley','Blackstone','Lazard','KKR','Jane Street']);

export default function HitRateIntelPage() {
  const router = useRouter();
  const [isDark, setIsDark] = useState(false);
  const [_userName, _setUserName] = useState({ first: '', last: '' });
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const plan = window.localStorage.getItem('offerbell_plan') || 'free';
    let profilePlan = 'free';
    try { const prof = JSON.parse(window.localStorage.getItem('offerbell_onboarding_profile') || '{}'); profilePlan = prof.plan || 'free'; } catch {}
    if (plan !== 'pro' && profilePlan !== 'pro') { router.replace('/dashboard?upgrade=hitrate'); return; }
  }, [router]);

  useEffect(() => {
    try {
      const raw = localStorage.getItem('offerbell_onboarding_profile');
      if (raw) {
        const p = JSON.parse(raw);
        _setUserName({ first: p.firstName || '', last: p.lastName || '' });
      }
    } catch (e) {}
  }, []);
  const _displayName = (_userName.first + ' ' + _userName.last).trim() || 'User';
  const _displayInitials = ((_userName.first[0] || '') + (_userName.last[0] || '')).toUpperCase() || 'U';

  const [activeTab, setActiveTab] = useState('30d');
  const [selectedFirms, setSelectedFirms] = useState<Set<string>>(DEFAULT_FIRMS);
  const [ddOpen, setDdOpen] = useState(false);
  const [ddQ, setDdQ] = useState('');
  const [barsAnimated, setBarsAnimated] = useState(false);
  const [yourRate, setYourRate] = useState('—');
  const [yourRateSub, setYourRateSub] = useState('from your tracker');
  const [yourRateColor, setYourRateColor] = useState('var(--green)');
  const [yourSent, setYourSent] = useState('—');
  const [yourSentSub, setYourSentSub] = useState('tracked in pipeline');
  const [yourAngle, setYourAngle] = useState('—');
  const [yourAngleSub, setYourAngleSub] = useState('based on your replies');
  const ddRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const t = localStorage.getItem('offerbell-theme');
    if (t === 'dark') { document.documentElement.setAttribute('data-theme','dark'); setIsDark(true); }
    setTimeout(() => setBarsAnimated(true), 300);
    try {
      const raw = localStorage.getItem('offerbell_tracker_v3');
      if (raw) {
        const contacts = JSON.parse(raw);
        if (contacts && contacts.length) {
          const sent = contacts.filter((c:any) => c.status !== 'drafted').length;
          const replied = contacts.filter((c:any) => ['spoken','stay'].includes(c.status)).length;
          const rate = sent > 0 ? Math.round(replied / sent * 100) : null;
          setYourSent(sent > 0 ? String(sent) : '—');
          setYourSentSub(sent === 1 ? '1 contact contacted' : `${sent} contacts contacted`);
          if (rate !== null && sent >= 3) {
            setYourRate(rate + '%');
            const diff = rate - 34;
            setYourRateSub(diff > 0 ? `↑ ${diff}% above platform avg` : diff < 0 ? `↓ ${Math.abs(diff)}% below platform avg` : 'At platform average');
            setYourRateColor(rate >= 34 ? 'var(--green)' : '#d97706');
          } else if (sent > 0 && sent < 3) {
            setYourRate('—');
            setYourRateSub('Send 3+ to see your rate');
          }
          const angleCounts: Record<string,number> = {};
          contacts.filter((c:any) => ['spoken','stay'].includes(c.status) && c.angle).forEach((c:any) => {
            angleCounts[c.angle] = (angleCounts[c.angle] || 0) + 1;
          });
          const best = Object.entries(angleCounts).sort((a,b) => b[1]-a[1])[0];
          if (best) { setYourAngle(best[0]); setYourAngleSub(`${best[1]} repl${best[1]===1?'y':'ies'} from this angle`); }
        }
      }
    } catch(e) {}
  }, []);

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (ddRef.current && !ddRef.current.contains(e.target as Node)) setDdOpen(false);
    }
    document.addEventListener('click', handleClick);
    return () => document.removeEventListener('click', handleClick);
  }, []);

  function toggleTheme() {
    const next = isDark ? 'light' : 'dark';
    document.documentElement.setAttribute('data-theme', next);
    setIsDark(!isDark);
    localStorage.setItem('offerbell-theme', next);
  }

  function toggleFirm(name: string) {
    const next = new Set(selectedFirms);
    if (next.has(name)) { if (next.size > 1) next.delete(name); } else next.add(name);
    setSelectedFirms(next);
  }

  const ddFirms = ddQ ? (ALL_FIRMS as any[]).filter((f:any) => f.name.toLowerCase().includes(ddQ.toLowerCase())) : ALL_FIRMS as any[];
  const visibleFirms = (ALL_FIRMS as any[]).filter((f:any) => selectedFirms.has(f.name));
  const colorMap: Record<string,string> = { green:'#16a34a', amber:'#d97706', red:'#dc2626' };

  const anglesData: Record<string, typeof anglesBase> = {
    '30d': [
      { key:'alumni', name:'Alumni', desc:'Same school, club, or recruiting process', rate:68, msgs:'2,800+', replies:'1,900+', avgDays:1.4, tier:'top' },
      { key:'interest', name:'Shared Interest', desc:'Common topic, research, or career focus', rate:54, msgs:'1,600+', replies:'870+', avgDays:2.1, tier:'mid' },
      { key:'deal', name:'Deal Reference', desc:'Reference a specific transaction they worked on', rate:41, msgs:'2,100+', replies:'860+', avgDays:2.8, tier:'mid' },
      { key:'mutual', name:'Mutual Connection', desc:'Someone referred you to them directly', rate:37, msgs:'980+', replies:'360+', avgDays:1.9, tier:'mid' },
      { key:'career', name:'Career Path', desc:'Following their trajectory into the firm', rate:32, msgs:'1,400+', replies:'460+', avgDays:3.2, tier:'low' },
      { key:'cold', name:'Cold / No Connection', desc:'No prior connection or shared context', rate:8, msgs:'3,400+', replies:'270+', avgDays:4.6, tier:'low' },
    ],
    '90d': [
      { key:'alumni', name:'Alumni', desc:'Same school, club, or recruiting process', rate:64, msgs:'7,400+', replies:'4,700+', avgDays:1.6, tier:'top' },
      { key:'interest', name:'Shared Interest', desc:'Common topic, research, or career focus', rate:51, msgs:'4,200+', replies:'2,100+', avgDays:2.3, tier:'mid' },
      { key:'deal', name:'Deal Reference', desc:'Reference a specific transaction they worked on', rate:38, msgs:'5,600+', replies:'2,100+', avgDays:3.1, tier:'mid' },
      { key:'mutual', name:'Mutual Connection', desc:'Someone referred you to them directly', rate:35, msgs:'2,500+', replies:'880+', avgDays:2.2, tier:'mid' },
      { key:'career', name:'Career Path', desc:'Following their trajectory into the firm', rate:29, msgs:'3,700+', replies:'1,070+', avgDays:3.5, tier:'low' },
      { key:'cold', name:'Cold / No Connection', desc:'No prior connection or shared context', rate:7, msgs:'8,900+', replies:'620+', avgDays:5.1, tier:'low' },
    ],
    'All time': [
      { key:'alumni', name:'Alumni', desc:'Same school, club, or recruiting process', rate:61, msgs:'18,200+', replies:'11,100+', avgDays:1.7, tier:'top' },
      { key:'interest', name:'Shared Interest', desc:'Common topic, research, or career focus', rate:48, msgs:'10,400+', replies:'4,990+', avgDays:2.5, tier:'mid' },
      { key:'deal', name:'Deal Reference', desc:'Reference a specific transaction they worked on', rate:36, msgs:'13,800+', replies:'4,960+', avgDays:3.3, tier:'mid' },
      { key:'mutual', name:'Mutual Connection', desc:'Someone referred you to them directly', rate:33, msgs:'6,100+', replies:'2,010+', avgDays:2.4, tier:'mid' },
      { key:'career', name:'Career Path', desc:'Following their trajectory into the firm', rate:27, msgs:'9,200+', replies:'2,480+', avgDays:3.7, tier:'low' },
      { key:'cold', name:'Cold / No Connection', desc:'No prior connection or shared context', rate:6, msgs:'21,500+', replies:'1,290+', avgDays:5.4, tier:'low' },
    ],
  };
  type AngleEntry = { key: string; name: string; desc: string; rate: number; msgs: string; replies: string; avgDays: number; tier: string };
  const anglesBase: AngleEntry[] = [];
  void anglesBase;
  const angles = anglesData[activeTab] || anglesData['30d'];

  const platformAvg: Record<string, { rate: string; msgs: string }> = {
    '30d': { rate: '34%', msgs: '10,000+' },
    '90d': { rate: '31%', msgs: '28,600+' },
    'All time': { rate: '29%', msgs: '68,400+' },
  };
  const currentPlatform = platformAvg[activeTab] || platformAvg['30d'];

  const daysData: Record<string, { label: string; rate: number; h: number; color: string; highlight: boolean }[]> = {
    '30d': [
      { label:'Mon', rate:28, h:38, color:'var(--border-2)', highlight:false },
      { label:'Tue', rate:61, h:58, color:'#16a34a', highlight:true },
      { label:'Wed', rate:58, h:54, color:'#16a34a', highlight:true },
      { label:'Thu', rate:44, h:52, color:'#d97706', highlight:false },
      { label:'Fri', rate:31, h:38, color:'var(--border-2)', highlight:false },
      { label:'Sat', rate:9, h:10, color:'var(--border-2)', highlight:false },
      { label:'Sun', rate:12, h:14, color:'var(--border-2)', highlight:false },
    ],
    '90d': [
      { label:'Mon', rate:31, h:40, color:'var(--border-2)', highlight:false },
      { label:'Tue', rate:56, h:54, color:'#16a34a', highlight:true },
      { label:'Wed', rate:53, h:52, color:'#16a34a', highlight:true },
      { label:'Thu', rate:40, h:46, color:'#d97706', highlight:false },
      { label:'Fri', rate:27, h:34, color:'var(--border-2)', highlight:false },
      { label:'Sat', rate:11, h:12, color:'var(--border-2)', highlight:false },
      { label:'Sun', rate:14, h:16, color:'var(--border-2)', highlight:false },
    ],
    'All time': [
      { label:'Mon', rate:29, h:38, color:'var(--border-2)', highlight:false },
      { label:'Tue', rate:52, h:50, color:'#16a34a', highlight:true },
      { label:'Wed', rate:49, h:48, color:'#16a34a', highlight:true },
      { label:'Thu', rate:37, h:42, color:'#d97706', highlight:false },
      { label:'Fri', rate:24, h:30, color:'var(--border-2)', highlight:false },
      { label:'Sat', rate:10, h:11, color:'var(--border-2)', highlight:false },
      { label:'Sun', rate:13, h:15, color:'var(--border-2)', highlight:false },
    ],
  };
  const days = daysData[activeTab] || daysData['30d'];

  const tips = [
    { title:'What the data says', body:<>The alumni angle outperforms cold outreach by <strong>8.5x</strong>. Finding a genuine shared connection before reaching out — even a shared career interest — doubles your reply rate vs. cold.</> },
    { title:'Send Tuesday or Wednesday', body:<>Messages sent Tuesday and Wednesday get <strong>2x higher reply rates</strong> than Friday or weekend messages. Aim for 9–11am or 12–1pm recipient time.</> },
    { title:'Keep it under 100 words', body:<>Messages under 100 words have a <strong>43% higher reply rate</strong> than messages over 150 words. Every extra sentence reduces your chances.</> },
    { title:'Follow up exactly once', body:<>A single follow-up after 5–7 days recovers <strong>22% of non-replies</strong>. Following up more than twice hurts your reply rate and your reputation at the firm.</> },
  ];

  const ddLabel = selectedFirms.size === 1 ? [...selectedFirms][0] : `${selectedFirms.size} firms selected`;

  return (
    <div className="app">
      <Sidebar activePage="hit-rate-intel" />

      <main className="main" style={{padding:'32px 36px'}}>
        <div style={{fontFamily:"'Instrument Serif',serif",fontSize:28,letterSpacing:'-.5px',color:'var(--text)',marginBottom:3}}>Hit Rate <em style={{fontStyle:'italic'}}>Intelligence</em></div>
        <div style={{fontSize:13,color:'var(--text-3)',marginBottom:6}}>Platform-wide reply rate data from {currentPlatform.msgs} outreach messages sent through OfferBell.</div>
        <div style={{display:'inline-flex',alignItems:'center',gap:5,background:'#fef3c7',border:'1.5px solid #fde68a',borderRadius:100,padding:'4px 12px',fontSize:11,fontWeight:700,color:'#92400e',marginBottom:12}}>Pro Feature — Live Data</div>

        <div style={{display:'flex',alignItems:'flex-start',gap:8,background:'var(--surface-2)',border:'1.5px solid var(--border)',borderRadius:10,padding:'12px 16px',marginBottom:24,fontSize:11,color:'var(--text-3)',lineHeight:1.6,maxWidth:700}}>
          <svg width="14" height="14" fill="none" stroke="currentColor" viewBox="0 0 24 24" style={{flexShrink:0,marginTop:1,opacity:.6}}><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
          <span><strong style={{color:'var(--text-2)'}}>Disclaimer:</strong> The reply rate data shown here represents industry estimates and aggregated benchmarks based on publicly available research and reported recruiter insights. These figures are not derived from live user activity and should be treated as directional guidance only, not guaranteed outcomes. Individual results will vary.</span>
        </div>

        <div style={{display:'grid',gridTemplateColumns:'repeat(4,1fr)',gap:12,marginBottom:24}}>
          {[
            { label:'Platform Avg Reply Rate', value:currentPlatform.rate, sub:`across all angles & firms`, color:'var(--text)' },
            { label:'Your Best Angle', value:yourAngle, sub:yourAngleSub, color:'var(--text)', italic:true },
            { label:'Your Messages Sent', value:yourSent, sub:yourSentSub, color:'var(--text)' },
            { label:'Your Reply Rate', value:yourRate, sub:yourRateSub, color:yourRateColor },
          ].map(s=>(
            <div key={s.label} style={{background:'var(--surface)',border:'1.5px solid var(--border)',borderRadius:14,padding:'18px 20px'}}>
              <div style={{fontSize:11,fontWeight:600,color:'var(--text-3)',textTransform:'uppercase',letterSpacing:'.5px',marginBottom:8}}>{s.label}</div>
              <div style={{fontSize:s.italic?18:28,fontWeight:800,color:s.color,letterSpacing:'-1px',lineHeight:1,marginBottom:4,fontFamily:s.italic?"'Instrument Serif',serif":'inherit',fontStyle:s.italic?'italic':'normal'}}>{s.value}</div>
              <div style={{fontSize:11,color:'var(--text-3)'}}>{s.sub}</div>
            </div>
          ))}
        </div>

        <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',marginBottom:14}}>
          <div>
            <div style={{fontSize:13,fontWeight:700,color:'var(--text)'}}>Reply Rate by Angle</div>
            <div style={{fontSize:12,color:'var(--text-3)'}}>Which message type actually gets responses</div>
          </div>
          <div style={{display:'flex',gap:4}}>
            {['30d','90d','All time'].map(t=>(
              <button key={t} onClick={()=>setActiveTab(t)} type="button" style={{padding:'4px 10px',borderRadius:6,fontSize:11,fontWeight:600,cursor:'pointer',border:`1.5px solid ${activeTab===t?'var(--text)':'var(--border-2)'}`,background:activeTab===t?'var(--text)':'var(--surface)',color:activeTab===t?'var(--surface)':'var(--text-3)',fontFamily:"'Sora',sans-serif"}}>{t}</button>
            ))}
          </div>
        </div>

        <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:10,marginBottom:24}}>
          {angles.map(a=>(
            <div key={a.key} style={{background:a.tier==='top'?'var(--hit-top-bg, #f0fdf4)':'var(--surface)',border:`1.5px solid ${a.tier==='top'?'var(--hit-top-border, #bbf7d0)':'var(--border)'}`,borderRadius:14,padding:'18px 20px',position:'relative',transition:'all .2s',cursor:'pointer'}}
              onMouseEnter={e=>(e.currentTarget.style.transform='translateY(-1px)')}
              onMouseLeave={e=>(e.currentTarget.style.transform='translateY(0)')}>
              {a.tier==='top'&&<div style={{position:'absolute',top:-8,right:16,background:'#16a34a',color:'#fff',fontSize:9,fontWeight:800,padding:'2px 8px',borderRadius:100,letterSpacing:'.5px',textTransform:'uppercase'}}>Best</div>}
              <div style={{display:'flex',alignItems:'flex-start',justifyContent:'space-between',marginBottom:14,marginTop:a.tier==='top'?8:0}}>
                <div>
                  <div style={{fontSize:14,fontWeight:700,color:'var(--text)',marginBottom:2}}>{a.name}</div>
                  <div style={{fontSize:11,color:'var(--text-3)'}}>{a.desc}</div>
                </div>
                <span style={{fontSize:13,fontWeight:800,padding:'4px 10px',borderRadius:8,flexShrink:0,marginLeft:8,color:a.tier==='top'?'#16a34a':a.tier==='mid'?'#d97706':'var(--text-3)',background:a.tier==='top'?'var(--hit-top-bg, #f0fdf4)':a.tier==='mid'?'var(--hit-mid-bg, #fffbeb)':'var(--surface-2)',border:`1.5px solid ${a.tier==='top'?'var(--hit-top-border, #bbf7d0)':a.tier==='mid'?'var(--hit-mid-border, #fde68a)':'var(--border)'}`}}>{a.rate}%</span>
              </div>
              <div style={{height:6,background:'var(--surface-2)',borderRadius:3,overflow:'hidden',marginBottom:10}}>
                <div style={{height:'100%',borderRadius:3,width:barsAnimated?`${a.rate}%`:'0%',transition:'width 1.2s cubic-bezier(.4,0,.2,1)',background:a.tier==='top'?'#16a34a':a.tier==='mid'?'#d97706':'var(--border-2)'}}/>
              </div>
              <div style={{display:'flex',gap:16}}>
                <div style={{fontSize:11,color:'var(--text-3)'}}><strong style={{color:'var(--text)'}}>{a.msgs}</strong> messages</div>
                <div style={{fontSize:11,color:'var(--text-3)'}}><strong style={{color:'var(--text)'}}>{a.replies}</strong> replies</div>
                <div style={{fontSize:11,color:'var(--text-3)'}}>Avg: <strong style={{color:'var(--text)'}}>{a.avgDays}d</strong></div>
              </div>
            </div>
          ))}
        </div>

        <div style={{marginBottom:10}}>
          <div style={{fontSize:13,fontWeight:700,color:'var(--text)'}}>Reply Rate by Firm</div>
          <div style={{fontSize:12,color:'var(--text-3)',marginBottom:10}}>Select the firms you're targeting to see their data</div>
        </div>

        <div style={{marginBottom:12,position:'relative',zIndex:50}} ref={ddRef}>
          <button onClick={()=>setDdOpen(!ddOpen)} type="button" style={{display:'inline-flex',alignItems:'center',gap:8,padding:'7px 14px',borderRadius:100,border:'1.5px solid var(--border-2)',background:'var(--surface)',cursor:'pointer',fontSize:13,fontWeight:600,color:'var(--text-2)',fontFamily:"'Sora',sans-serif"}}>
            <span>{ddLabel}</span>
            <svg width="12" height="12" fill="none" stroke="currentColor" viewBox="0 0 24 24"><polyline points="6 9 12 15 18 9"/></svg>
          </button>
          {ddOpen&&(
            <div style={{position:'absolute',top:'calc(100% + 6px)',left:0,background:'var(--surface)',border:'1.5px solid var(--border)',borderRadius:14,boxShadow:'0 8px 32px rgba(0,0,0,.12)',width:280,zIndex:100,overflow:'hidden'}}>
              <div style={{padding:'10px 12px',borderBottom:'1px solid var(--border)'}}>
                <input value={ddQ} onChange={e=>setDdQ(e.target.value)} placeholder="Search firms…" autoFocus style={{width:'100%',padding:'7px 10px',border:'1.5px solid var(--border-2)',borderRadius:8,fontSize:12,fontFamily:"'Sora',sans-serif",color:'var(--text)',background:'var(--bg)',outline:'none'}}/>
              </div>
              <div style={{maxHeight:260,overflowY:'auto',padding:6}}>
                {ddFirms.map((f:any)=>(
                  <button key={f.name} onMouseDown={e=>{e.preventDefault();toggleFirm(f.name);}} type="button" style={{display:'flex',alignItems:'center',justifyContent:'space-between',width:'100%',padding:'7px 10px',borderRadius:7,fontSize:12,fontWeight:selectedFirms.has(f.name)?700:500,color:selectedFirms.has(f.name)?'var(--text)':'var(--text-2)',cursor:'pointer',background:'none',border:'none',fontFamily:"'Sora',sans-serif",textAlign:'left'}}>
                    <span style={{display:'flex',alignItems:'center',gap:7}}>
                      <span style={{width:10,height:10,borderRadius:3,background:f.color,display:'inline-block',flexShrink:0}}/>
                      {f.name}
                    </span>
                    {selectedFirms.has(f.name)&&<span>✓</span>}
                  </button>
                ))}
              </div>
              <div style={{padding:'8px 12px',borderTop:'1px solid var(--border)',display:'flex',justifyContent:'space-between',alignItems:'center'}}>
                <button onClick={()=>setSelectedFirms(new Set((ALL_FIRMS as any[]).map((f:any)=>f.name)))} type="button" style={{fontSize:11,fontWeight:600,color:'var(--text-3)',background:'none',border:'none',cursor:'pointer',fontFamily:"'Sora',sans-serif",padding:0}}>Select all</button>
                <button onClick={()=>setSelectedFirms(new Set([(ALL_FIRMS as any[])[0].name]))} type="button" style={{fontSize:11,fontWeight:600,color:'var(--text-3)',background:'none',border:'none',cursor:'pointer',fontFamily:"'Sora',sans-serif",padding:0}}>Clear all</button>
                <button onClick={()=>setDdOpen(false)} type="button" style={{fontSize:11,fontWeight:700,color:'var(--surface)',background:'var(--text)',border:'none',cursor:'pointer',fontFamily:"'Sora',sans-serif",padding:'4px 12px',borderRadius:6}}>Done</button>
              </div>
            </div>
          )}
        </div>

        <div style={{background:'var(--surface)',border:'1.5px solid var(--border)',borderRadius:14,overflow:'hidden',marginBottom:24}}>
          <div style={{display:'grid',gridTemplateColumns:'2fr 1fr 1fr 1fr',padding:'10px 16px',background:'#1a1a19',gap:8}}>
            {['Firm','Reply Rate','Avg Response','Best Angle'].map(h=>(
              <div key={h} style={{fontSize:10,fontWeight:700,textTransform:'uppercase',letterSpacing:'.8px',color:'rgba(255,255,255,.6)'}}>{h}</div>
            ))}
          </div>
          {visibleFirms.map((f:any,i:number)=>(
            <div key={f.name} style={{display:'grid',gridTemplateColumns:'2fr 1fr 1fr 1fr',padding:'12px 16px',borderBottom:i<visibleFirms.length-1?'1px solid var(--border)':'none',gap:8,alignItems:'center',cursor:'pointer',transition:'background .1s'}}
              onMouseEnter={e=>(e.currentTarget.style.background='var(--surface-2)')}
              onMouseLeave={e=>(e.currentTarget.style.background='transparent')}>
              <div style={{display:'flex',alignItems:'center',gap:8,fontSize:13,fontWeight:700,color:'var(--text)'}}>
                <div style={{width:24,height:24,borderRadius:6,background:f.color,display:'flex',alignItems:'center',justifyContent:'center',fontSize:8,fontWeight:800,color:'#fff',flexShrink:0}}>{f.logo}</div>
                {f.name}
              </div>
              <div>
                <div style={{fontSize:13,fontWeight:600,color:colorMap[f.tier]}}>{f.rate}%</div>
                <div style={{height:4,background:'var(--surface-2)',borderRadius:2,overflow:'hidden',marginTop:4}}>
                  <div style={{width:barsAnimated?`${f.rate}%`:'0%',height:'100%',borderRadius:2,background:colorMap[f.tier],transition:'width 1.2s cubic-bezier(.4,0,.2,1)'}}/>
                </div>
              </div>
              <div style={{fontSize:13,fontWeight:600,color:'var(--text)'}}>{f.days}</div>
              <div style={{fontSize:11,color:'var(--text-3)'}}>{f.angle}</div>
            </div>
          ))}
          {visibleFirms.length===0&&<div style={{padding:'32px 20px',textAlign:'center',fontSize:13,color:'var(--text-3)'}}>No firms selected — use the dropdown above to add firms.</div>}
        </div>

        <div style={{background:'var(--surface)',border:'1.5px solid var(--border)',borderRadius:14,padding:20,marginBottom:24}}>
          <div style={{fontSize:13,fontWeight:700,color:'var(--text)',marginBottom:2}}>Best Day to Send</div>
          <div style={{fontSize:12,color:'var(--text-3)',marginBottom:20}}>Reply rates by day of week — platform-wide</div>
          <div style={{display:'flex',gap:6,alignItems:'flex-end',height:80}}>
            {days.map(d=>(
              <div key={d.label} style={{display:'flex',flexDirection:'column',alignItems:'center',gap:3,flex:1,justifyContent:'flex-end'}}>
                <div style={{width:'100%',height:barsAnimated?d.h+'px':'0px',background:d.color,borderRadius:'4px 4px 0 0',transition:'height 1s cubic-bezier(.4,0,.2,1)',flexShrink:0}}/>
                <div style={{fontSize:9,fontWeight:d.highlight?700:600,color:d.highlight?'#16a34a':'var(--text-3)'}}>{d.label}</div>
                <div style={{fontSize:10,fontWeight:d.highlight?800:700,color:d.highlight?'#16a34a':'var(--text-3)'}}>{d.rate}%</div>
              </div>
            ))}
          </div>
        </div>

        <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:10}}>
          {tips.map(t=>(
            <div key={t.title} style={{background:'var(--surface)',border:'1.5px solid var(--border)',borderRadius:14,padding:'18px 20px'}}>
              <div style={{display:'flex',alignItems:'center',gap:8,marginBottom:10}}>
                <div style={{width:28,height:28,borderRadius:8,background:'var(--surface-2)',display:'flex',alignItems:'center',justifyContent:'center',fontSize:11,fontWeight:800,color:'var(--text-3)',flexShrink:0}}>→</div>
                <div style={{fontSize:13,fontWeight:700,color:'var(--text)'}}>{t.title}</div>
              </div>
              <div style={{fontSize:12,color:'var(--text-2)',lineHeight:1.7}}>{t.body}</div>
            </div>
          ))}
        </div>

      </main>
    </div>
  );
}
