'use client';

import Sidebar from "../components/Sidebar";
import { useState, useEffect } from 'react';
import Link from 'next/link';
import '../contact-finder/contact-finder.css';
import { useMutation } from 'convex/react';
import { api } from '../../convex/_generated/api';

export default function OutreachWriterPage() {
  const incrementOutreachCount = useMutation(api.users.incrementOutreachCount);
  const [isDark, setIsDark] = useState(false);
  const [_userName, _setUserName] = useState({ first: '', last: '' });
  useEffect(() => {
    try {
      const raw = localStorage.getItem('offerbell_onboarding_profile');
      if (raw) {
        const prof = JSON.parse(raw);
        setYourName(((prof.firstName || '') + ' ' + (prof.lastName || '')).trim());
        setYourSchool(prof.university || '');
        setYourYear(prof.year || '');
        if (prof.targetRoles && prof.targetRoles.length > 0) setYourTarget(prof.targetRoles[0]);
      }
      if (raw) {
        const p = JSON.parse(raw);
        _setUserName({ first: p.firstName || '', last: p.lastName || '' });
      }
    } catch (e) {}
  }, []);
  const _displayName = (_userName.first + ' ' + _userName.last).trim() || 'User';
  const _displayInitials = ((_userName.first[0] || '') + (_userName.last[0] || '')).toUpperCase() || 'U';

  const [messagesSent, setMessagesSent] = useState(0);
  useEffect(() => {
    try {
      // Per-account display counter only. The actual rate limit is enforced
      // server-side in /api/generate-outreach via checkPlanLimit, so we no
      // longer cross-reference a global cookie - that was leaking counts
      // between accounts on the same browser (fresh accounts inheriting old
      // counts from prior signups).
      const localCount = parseInt(localStorage.getItem('offerbell_messages_sent') || '0', 10);
      setMessagesSent(localCount);
      // Sync to extension if installed
      try {
        const extensionId = 'ecmiggmdjpohgidmdonhbcbnlhdagmkp';
        if (extensionId && typeof chrome !== 'undefined' && chrome.runtime?.sendMessage) {
          chrome.runtime.sendMessage(extensionId, {
            action: 'updateCount',
            messagesSent: localCount,
            plan: localStorage.getItem('offerbell_plan') || 'free',
            userId: localStorage.getItem('offerbell_user_id') || ''
          }, () => {});
        }
      } catch {}
    } catch {}
  }, []);

  const [step, setStep] = useState(1);
  const [userPlan, setUserPlan] = useState('free');
  useEffect(() => {
    const plan = localStorage.getItem('offerbell_plan') || 'free';
    try { const prof = JSON.parse(localStorage.getItem('offerbell_onboarding_profile') || '{}'); setUserPlan(prof.plan || plan); } catch { setUserPlan(plan); }
  }, []);
  const [contactName, setContactName] = useState('');
  const [contactFirm, setContactFirm] = useState('');
  const [contactRole, setContactRole] = useState('');
  const [contactSchool, setContactSchool] = useState('');
  const [yourName, setYourName] = useState('');
  const [yourSchool, setYourSchool] = useState('');
  const [yourYear, setYourYear] = useState('');
  const [yourTarget, setYourTarget] = useState('Investment Banking');
  const [angle, setAngle] = useState('alumni');
  const [ctx, setCtx] = useState('');
  const [tone, setTone] = useState('Professional');
  const [output, setOutput] = useState('');
  const [subject, setSubject] = useState('');
  const [generating, setGenerating] = useState(false);
  const [copied, setCopied] = useState(false);
  const [toast, setToast] = useState('');
  const [savedMsgs, setSavedMsgs] = useState<{id:string;contact:string;firm:string;angle:string;subject:string;body:string;date:string}[]>([]);
  const [showSaved, setShowSaved] = useState(false);
  const [expandedDraft, setExpandedDraft] = useState<string | null>(null);

  useEffect(() => {
    const t = localStorage.getItem('offerbell-theme');
    if (t === 'dark') { document.documentElement.setAttribute('data-theme', 'dark'); setIsDark(true); }
    try {
      const raw = localStorage.getItem('offerbell_saved_messages');
      if (raw) setSavedMsgs(JSON.parse(raw));
    } catch {}
  }, []);

  function toggleTheme() {
    const next = isDark ? 'light' : 'dark';
    document.documentElement.setAttribute('data-theme', next);
    setIsDark(!isDark);
    localStorage.setItem('offerbell-theme', next);
  }

  function showToast(msg: string) {
    setToast(msg);
    setTimeout(() => setToast(''), 2500);
  }

  function saveMessage() {
    if (!output) return;
    const msg = {
      id: Date.now().toString(),
      contact: contactName.trim() || 'Unknown',
      firm: contactFirm.trim() || 'Unknown',
      angle: angles.find(a => a.key === angle)?.label || angle,
      subject,
      body: output,
      date: new Date().toISOString(),
    };
    const updated = [msg, ...savedMsgs].slice(0, 20);
    setSavedMsgs(updated);
    localStorage.setItem('offerbell_saved_messages', JSON.stringify(updated));
    showToast('Message saved');
  }

  function deleteSavedMsg(id: string) {
    const updated = savedMsgs.filter(m => m.id !== id);
    setSavedMsgs(updated);
    localStorage.setItem('offerbell_saved_messages', JSON.stringify(updated));
    showToast('Deleted');
  }

  function saveToTracker() {
    const angleLabel = angles.find(a => a.key === angle)?.label || angle;
    const c = {
      id: Date.now().toString(),
      fname: contactName.trim() || 'No Name',
      lname: '',
      firm: contactFirm.trim() || 'Unknown Firm',
      role: contactRole.trim() || 'Unknown Role',
      status: 'drafted',
      angle: angleLabel,
      notes: subject ? 'Subject: ' + subject : '',
      quality: '',
      createdAt: Date.now(),
      lastContact: null,
    };
    if (contactName.includes(' ')) {
      const parts = contactName.trim().split(' ');
      c.fname = parts[0];
      c.lname = parts.slice(1).join(' ');
    }
    const t = localStorage.getItem('offerbell_tracker_v3');
    const existing = t ? JSON.parse(t) : [];
    localStorage.setItem('offerbell_tracker_v3', JSON.stringify([...existing, c]));
    showToast('Saved to Outreach Tracker');
  }

  function goToStep(n: number) {
    if (n === 3) generate();
    setStep(n);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  async function generate() {
    // Plan-based limits
    const plan = userPlan;
    if (plan === 'free' || plan !== 'pro' && plan !== 'elite') {
      if (messagesSent >= 5) {
        showToast('You have reached your free plan limit of 5 messages. Upgrade to Pro for 20/week.');
        return;
      }
    } else {
      // Pro/Elite: weekly limit
      const weeklyUsed = (() => {
        try {
          const raw = localStorage.getItem('offerbell_outreach_weekly');
          if (!raw) return 0;
          const d = JSON.parse(raw);
          const now = new Date(); const day = now.getDay(); const diff = day === 0 ? 6 : day - 1;
          const mon = new Date(now); mon.setDate(now.getDate() - diff); mon.setHours(0,0,0,0);
          const week = mon.toISOString().split('T')[0];
          if (d.week !== week) { localStorage.setItem('offerbell_outreach_weekly', JSON.stringify({ week, count: 0 })); return 0; }
          return d.count || 0;
        } catch { return 0; }
      })();
      const weeklyMax = plan === 'elite' ? 30 : 20;
      if (weeklyUsed >= weeklyMax) {
        showToast(`You have used all ${weeklyMax} messages this week. Resets Monday.`);
        return;
      }
    }

    setGenerating(true);
    setOutput('');
    setSubject('');

    const angleLabel = angles.find(a => a.key === angle)?.label || angle;
    const prompt = `Write a compelling cold email for an undergraduate student to a finance professional.
Student Info: name=${yourName}, school=${yourSchool}, year=${yourYear}, target role=${yourTarget}.
Contact Info: name=${contactName}, firm=${contactFirm}, role=${contactRole}, school=${contactSchool}.
Networking Angle: ${angleLabel}. Context: ${ctx || 'None provided'}.
Tone: ${tone}.

Rules:
1. Do not use overly formal or robotic words like "delve", "robust", "thrilled", or "tapestry".
2. Make it sound like a natural, ambitious college student. Length should be around 4 to 8 sentences, providing enough detail without being desperate.
3. The very first line must be exactly "Subject: [your subject here]". Then two newlines, then the email body. Do not include any other commentary before or after.
4. Ensure the subject line uses grammatically correct Title Case (e.g., capitalize the first letter of each major word).
5. Pay close attention to the contact's specific role and firm. Do not mistakenly refer to the contact's job as the student's target role if they are different.`;

    try {
      const res = await fetch('/api/generate-outreach', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt })
      });
      
      const data = await res.json();
      const rawText = data.text || '';
      
      const match = rawText.match(/^Subject:\s*(.+)$/im);
      if (match) {
        setSubject(match[1]);
        setOutput(rawText.replace(/^Subject:\s*.+(\r?\n)+/i, '').trim());
      } else {
        setSubject('Networking Context');
        setOutput(rawText.trim());
      }
      
      try { 
        const storedUid = window.localStorage.getItem("offerbell_user_id");
        if (storedUid) {
          const newQ = await incrementOutreachCount({ userId: storedUid as any });
          localStorage.setItem("offerbell_messages_sent", String(newQ));
          setMessagesSent(newQ);
        } else {
          const prev = parseInt(localStorage.getItem("offerbell_messages_sent") || "0", 10); 
          localStorage.setItem("offerbell_messages_sent", String(prev + 1)); 
          setMessagesSent(prev + 1);
        }
        // Increment weekly usage for Pro/Elite
        if (userPlan === 'pro' || userPlan === 'elite') {
          try {
            const now = new Date(); const day = now.getDay(); const diff = day === 0 ? 6 : day - 1;
            const mon = new Date(now); mon.setDate(now.getDate() - diff); mon.setHours(0,0,0,0);
            const week = mon.toISOString().split('T')[0];
            const raw = localStorage.getItem('offerbell_outreach_weekly');
            let wk = raw ? JSON.parse(raw) : { week, count: 0 };
            if (wk.week !== week) wk = { week, count: 0 };
            wk.count++;
            localStorage.setItem('offerbell_outreach_weekly', JSON.stringify(wk));
          } catch {}
        }
        // Also sync plan
        const currentPlan = localStorage.getItem('offerbell_plan') || 'free';
        document.cookie = `offerbell_plan=${currentPlan}; path=/; max-age=2592000; SameSite=Lax`;
      } catch {}
    } catch (e) {
      console.error(e);
      setSubject('Error');
      setOutput('Failed to generate email. Please try again.');
    } finally {
      setGenerating(false);
    }
  }

  function copyMsg() {
    navigator.clipboard.writeText(`Subject: ${subject}\n\n${output}`);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
    showToast('Copied to clipboard');
  }

  const angles = [
    { key: 'alumni', label: 'Alumni', sub: 'Same school, club, or program' },
    { key: 'deal', label: 'Deal Reference', sub: 'Reference a recent transaction' },
    { key: 'interest', label: 'Shared Interest', sub: 'Common topic or research area' },
    { key: 'mutual', label: 'Mutual Connection', sub: 'Someone referred you to them' },
    { key: 'career', label: 'Career Path', sub: 'Following a similar trajectory' },
    { key: 'cold', label: 'No Connection', sub: 'Pure cold outreach' },
  ];
  const ctxLabels: Record<string, string> = {
    alumni: 'What do you have in common?',
    deal: 'Which deal or transaction?',
    interest: "What's the shared interest?",
    mutual: 'Who referred you?',
    career: 'What path are you targeting?',
    cold: 'Why this specific person?',
  };
  const ctxPlaceholders: Record<string, string> = {
    alumni: 'e.g. NYU Stern IB Club, Goldman on-campus recruiting',
    deal: "e.g. Goldman's acquisition of GreenSky, their TMT coverage",
    interest: 'e.g. semiconductor M&A, impact investing, distressed debt',
    mutual: 'e.g. Jane Smith, your colleague at Goldman',
    career: 'e.g. IB at a bulge bracket, then buyside PE',
    cold: 'e.g. Their group covers sectors I want to work in',
  };
  const rates: Record<string, string> = { alumni: '68%', deal: '41%', interest: '54%', mutual: '37%', career: '32%', cold: '8%' };

  return (
    <div className="app">
      <Sidebar activePage="outreach-writer" />

      <main className="main" style={{padding:'40px 0',display:'flex',flexDirection:'column',alignItems:'center'}}>
        <div style={{width:'100%',maxWidth:700,padding:'0 28px'}}>

          <div style={{display:'flex',alignItems:'flex-start',justifyContent:'space-between',marginBottom:24,gap:16}}>
            <div>
              <div style={{fontFamily:"'Instrument Serif',serif",fontSize:34,letterSpacing:'-0.7px',color:'var(--text)',marginBottom:4,lineHeight:1}}>Outreach <em style={{fontStyle:'italic'}}>Writer</em></div>
              <div style={{fontSize:13,color:'var(--text-3)',marginTop:6}}>Three steps to a personalized cold email that gets replies.</div>
            </div>
            <div style={{display:'flex',gap:8,flexShrink:0,alignItems:'center'}}>
              <div style={{display:'inline-flex',alignItems:'center',gap:5,background:'var(--surface)',border:'1.5px solid var(--border)',borderRadius:100,padding:'6px 14px',fontSize:11,fontWeight:600,color:'var(--text-2)'}}>
                <span style={{width:5,height:5,borderRadius:'50%',background:'#22c55e',display:'inline-block'}}></span>
                {(() => {
                  if (userPlan === 'elite') {
                    const raw = localStorage.getItem('offerbell_outreach_weekly');
                    let used = 0;
                    try { const d = JSON.parse(raw || '{}'); const now = new Date(); const day = now.getDay(); const diff = day === 0 ? 6 : day - 1; const mon = new Date(now); mon.setDate(now.getDate() - diff); mon.setHours(0,0,0,0); const week = mon.toISOString().split('T')[0]; if (d.week === week) used = d.count || 0; } catch {}
                    return `${30 - used} of 30 left this week`;
                  }
                  if (userPlan === 'pro') {
                    const raw = localStorage.getItem('offerbell_outreach_weekly');
                    let used = 0;
                    try { const d = JSON.parse(raw || '{}'); const now = new Date(); const day = now.getDay(); const diff = day === 0 ? 6 : day - 1; const mon = new Date(now); mon.setDate(now.getDate() - diff); mon.setHours(0,0,0,0); const week = mon.toISOString().split('T')[0]; if (d.week === week) used = d.count || 0; } catch {}
                    return `${20 - used} of 20 left this week`;
                  }
                  return `${Math.max(0, 5 - messagesSent)} of 5 left`;
                })()}
              </div>
              {savedMsgs.length > 0 && (
                <button onClick={()=>setShowSaved(true)} type="button" style={{display:'inline-flex',alignItems:'center',gap:6,background:'var(--surface)',border:'1.5px solid var(--border)',borderRadius:100,padding:'6px 14px',fontSize:11,fontWeight:600,color:'var(--text-2)',cursor:'pointer',fontFamily:"'Sora',sans-serif"}}>
                  <svg width="13" height="13" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"/><polyline points="17 21 17 13 7 13 7 21"/></svg>
                  Drafts ({savedMsgs.length})
                </button>
              )}
            </div>
          </div>

          {/* Steps */}
          <div style={{display:'flex',alignItems:'center',marginBottom:28}}>
            {[1,2,3].map((n,i) => (
              <div key={n} style={{display:'flex',alignItems:'center',flex:i<2?1:'initial'}}>
                <div style={{display:'flex',alignItems:'center',gap:8}}>
                  <div style={{width:28,height:28,borderRadius:'50%',border:`1.5px solid ${step===n?'var(--text)':step>n?'#16a34a':'var(--border-2)'}`,background:step===n?'var(--text)':step>n?'#16a34a':'var(--surface)',display:'flex',alignItems:'center',justifyContent:'center',fontSize:11,fontWeight:700,color:step===n?'var(--surface)':step>n?'#fff':'var(--text-3)',flexShrink:0}}>
                    {step>n?<svg width="12" height="12" fill="none" stroke="currentColor" strokeWidth="3" viewBox="0 0 24 24"><polyline points="20 6 9 17 4 12"/></svg>:n}
                  </div>
                  <span style={{fontSize:12,fontWeight:600,color:step===n?'var(--text)':'var(--text-3)',whiteSpace:'nowrap'}}>{['Contact','Angle','Generate'][n-1]}</span>
                </div>
                {i<2&&<div style={{flex:1,height:1,background:step>n?'#16a34a':'var(--border-2)',margin:'0 8px',transition:'background 0.3s'}}/>}
              </div>
            ))}
          </div>

          {/* Step 1 */}
          {step===1&&(
            <div>
              <div style={{background:'var(--surface)',border:'1.5px solid var(--border)',borderRadius:16,marginBottom:16}}>
                <div style={{padding:24}}>
                  <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:14,marginBottom:12}}>
                    {[{label:'Name',val:contactName,set:setContactName,ph:'e.g. Emily Zhang'},{label:'Firm',val:contactFirm,set:setContactFirm,ph:'e.g. Goldman Sachs'}].map(f=>(
                      <div key={f.label}>
                        <label style={{display:'block',fontSize:12,fontWeight:700,color:'var(--text)',marginBottom:6}}>{f.label}</label>
                        <input style={{width:'100%',height:44,padding:'0 14px',border:'1.5px solid var(--border-2)',borderRadius:10,fontSize:13,fontFamily:"'Sora',sans-serif",color:'var(--text)',background:'var(--bg)',outline:'none'}} type="text" value={f.val} onChange={e=>f.set(e.target.value)} placeholder={f.ph}/>
                      </div>
                    ))}
                  </div>
                  <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:14,marginBottom:20}}>
                    {[{label:'Role',val:contactRole,set:setContactRole,ph:'e.g. IB Analyst'},{label:'Their school (optional)',val:contactSchool,set:setContactSchool,ph:'e.g. NYU Stern'}].map(f=>(
                      <div key={f.label}>
                        <label style={{display:'block',fontSize:12,fontWeight:700,color:'var(--text)',marginBottom:6}}>{f.label}</label>
                        <input style={{width:'100%',height:44,padding:'0 14px',border:'1.5px solid var(--border-2)',borderRadius:10,fontSize:13,fontFamily:"'Sora',sans-serif",color:'var(--text)',background:'var(--bg)',outline:'none'}} type="text" value={f.val} onChange={e=>f.set(e.target.value)} placeholder={f.ph}/>
                      </div>
                    ))}
                  </div>
                  <div style={{textAlign:'center',fontSize:11,fontWeight:700,color:'var(--text-3)',textTransform:'uppercase',letterSpacing:1,margin:'0 0 16px',position:'relative'}}>
                    <span style={{background:'var(--surface)',padding:'0 8px',position:'relative',zIndex:1}}>about you</span>
                    <div style={{position:'absolute',top:'50%',left:0,right:0,height:1,background:'var(--border)',zIndex:0}}/>
                  </div>
                  <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:14,marginBottom:12}}>
                    {[{label:'Your name',val:yourName,set:setYourName,ph:'Your name'},{label:'Your school',val:yourSchool,set:setYourSchool,ph:'e.g. NYU Stern'}].map(f=>(
                      <div key={f.label}>
                        <label style={{display:'block',fontSize:12,fontWeight:700,color:'var(--text)',marginBottom:6}}>{f.label}</label>
                        <input style={{width:'100%',height:44,padding:'0 14px',border:'1.5px solid var(--border-2)',borderRadius:10,fontSize:13,fontFamily:"'Sora',sans-serif",color:'var(--text)',background:'var(--bg)',outline:'none'}} type="text" value={f.val} onChange={e=>f.set(e.target.value)} placeholder={f.ph}/>
                      </div>
                    ))}
                  </div>
                  <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:14}}>
                    {[{label:'Year',val:yourYear,set:setYourYear,ph:'e.g. Junior'},{label:'Target role',val:yourTarget,set:setYourTarget,ph:'e.g. Investment Banking'}].map(f=>(
                      <div key={f.label}>
                        <label style={{display:'block',fontSize:12,fontWeight:700,color:'var(--text)',marginBottom:6}}>{f.label}</label>
                        <input style={{width:'100%',height:44,padding:'0 14px',border:'1.5px solid var(--border-2)',borderRadius:10,fontSize:13,fontFamily:"'Sora',sans-serif",color:'var(--text)',background:'var(--bg)',outline:'none'}} type="text" value={f.val} onChange={e=>f.set(e.target.value)} placeholder={f.ph}/>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              <div style={{display:'flex',justifyContent:'flex-end'}}>
                <button onClick={()=>goToStep(2)} style={{background:'var(--text)',color:'var(--surface)',padding:'10px 28px',borderRadius:10,fontSize:13,fontWeight:700,cursor:'pointer',border:'none',fontFamily:"'Sora',sans-serif"}}>Choose angle &rarr;</button>
              </div>
            </div>
          )}

          {/* Step 2 */}
          {step===2&&(
            <div>
              <div style={{background:'var(--surface)',border:'1.5px solid var(--border)',borderRadius:16,marginBottom:16}}>
                <div style={{padding:24}}>
                  <label style={{display:'block',fontSize:12,fontWeight:700,color:'var(--text)',marginBottom:6}}>What's your connection to them?</label>
                  <div style={{fontSize:11,color:'var(--text-3)',marginBottom:12}}>Alumni and deal reference angles get the highest reply rates.</div>
                  <div style={{display:'grid',gridTemplateColumns:'repeat(3,1fr)',gap:8,marginBottom:16}}>
                    {angles.map(a=>(
                      <div key={a.key} onClick={()=>{setAngle(a.key);setCtx('');}} style={{border:`1.5px solid ${angle===a.key?'var(--text)':'var(--border)'}`,borderRadius:12,padding:'14px 16px',cursor:'pointer',background:angle===a.key?'var(--text)':'var(--surface)'}}>
                        <div style={{fontSize:13,fontWeight:700,color:angle===a.key?'var(--surface)':'var(--text)',marginBottom:3}}>{a.label}</div>
                        <div style={{fontSize:11,color:angle===a.key?'rgba(255,255,255,.45)':'var(--text-3)',lineHeight:1.4}}>{a.sub}</div>
                      </div>
                    ))}
                  </div>
                  <div style={{background:'var(--surface-2)',borderRadius:10,padding:16,marginBottom:16}}>
                    <div style={{fontSize:11,fontWeight:700,color:'var(--text-3)',textTransform:'uppercase',letterSpacing:.5,marginBottom:8}}>{ctxLabels[angle]}</div>
                    <input style={{width:'100%',height:44,padding:'0 14px',border:'1.5px solid var(--border-2)',borderRadius:10,fontSize:13,fontFamily:"'Sora',sans-serif",color:'var(--text)',background:'var(--bg)',outline:'none'}} type="text" value={ctx} onChange={e=>setCtx(e.target.value)} placeholder={ctxPlaceholders[angle]}/>
                  </div>
                  <label style={{display:'block',fontSize:12,fontWeight:700,color:'var(--text)',marginBottom:8}}>Tone</label>
                  <div style={{display:'flex',gap:6}}>
                    {['Professional','Conversational','Direct & brief'].map(t=>(
                      <button key={t} onClick={()=>setTone(t)} type="button" style={{padding:'6px 14px',borderRadius:100,border:`1.5px solid ${tone===t?'var(--text)':'var(--border-2)'}`,background:tone===t?'var(--text)':'var(--surface)',fontSize:12,fontWeight:600,color:tone===t?'var(--surface)':'var(--text-2)',cursor:'pointer',fontFamily:"'Sora',sans-serif"}}>{t}</button>
                    ))}
                  </div>
                </div>
              </div>
              <div style={{display:'flex',justifyContent:'space-between'}}>
                <button onClick={()=>setStep(1)} style={{background:'none',border:'1.5px solid var(--border-2)',color:'var(--text-2)',padding:'10px 20px',borderRadius:10,fontSize:13,fontWeight:600,cursor:'pointer',fontFamily:"'Sora',sans-serif"}}>← Back</button>
                <button onClick={()=>goToStep(3)} style={{background:'var(--text)',color:'var(--surface)',padding:'10px 28px',borderRadius:10,fontSize:13,fontWeight:700,cursor:'pointer',border:'none',fontFamily:"'Sora',sans-serif"}}>Generate message →</button>
              </div>
            </div>
          )}

          {/* Step 3 */}
          {step===3&&(
            <div>
              <div style={{background:'var(--surface)',border:'1.5px solid var(--border)',borderRadius:16,overflow:'hidden',marginBottom:16}}>
                <div style={{padding:'16px 20px',borderBottom:'1px solid var(--border)',display:'flex',alignItems:'center',justifyContent:'space-between'}}>
                  <div style={{display:'flex',alignItems:'center',gap:8}}>
                    <span style={{fontSize:13,fontWeight:700,color:'var(--text)'}}>Your Message</span>
                    <span style={{fontSize:10,fontWeight:700,background:'var(--surface-2)',color:'var(--text-3)',padding:'3px 8px',borderRadius:5}}>{angles.find(a=>a.key===angle)?.label} angle</span>
                  </div>
                  {output&&(
                    <div style={{display:'flex',gap:8}}>
                      <button onClick={()=>goToStep(3)} style={{display:'flex',alignItems:'center',padding:'6px 12px',borderRadius:8,fontSize:12,fontWeight:600,cursor:'pointer',background:'var(--surface)',color:'var(--text-2)',border:'1.5px solid var(--border-2)',fontFamily:"'Sora',sans-serif"}}>&#8635; Regenerate</button>
                      <button onClick={copyMsg} style={{display:'flex',alignItems:'center',padding:'6px 12px',borderRadius:8,fontSize:12,fontWeight:600,cursor:'pointer',background:'var(--surface)',color:'var(--text-2)',border:'1.5px solid var(--border-2)',fontFamily:"'Sora',sans-serif"}}>{copied?'Copied!':'Copy'}</button>
                      <button onClick={saveMessage} style={{display:'flex',alignItems:'center',padding:'6px 12px',borderRadius:8,fontSize:12,fontWeight:600,cursor:'pointer',background:'var(--surface)',color:'var(--text-2)',border:'1.5px solid var(--border-2)',fontFamily:"'Sora',sans-serif"}}>Save Draft</button>
                      <button onClick={saveToTracker} style={{display:'flex',alignItems:'center',padding:'6px 12px',borderRadius:8,fontSize:12,fontWeight:700,cursor:'pointer',background:'var(--text)',color:'var(--surface)',border:'none',fontFamily:"'Sora',sans-serif"}}>Save to Tracker</button>
                    </div>
                  )}
                </div>
                <div style={{padding:24,minHeight:240}}>
                  {generating?(
                    <div style={{display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'center',height:200,textAlign:'center'}}>
                      <div style={{fontFamily:"'Instrument Serif',serif",fontSize:18,fontStyle:'italic',color:'var(--text)',marginBottom:6}}>Generating your message…</div>
                      <div style={{fontSize:13,color:'var(--text-3)'}}>Just a second.</div>
                    </div>
                  ):output?(
                    <div>
                      <div style={{fontSize:11,fontWeight:700,color:'var(--text-3)',textTransform:'uppercase',letterSpacing:.5,marginBottom:6}}>Subject line</div>
                      <div style={{fontSize:14,fontWeight:700,color:'var(--text)',marginBottom:20,paddingBottom:16,borderBottom:'1px solid var(--border)'}}>{subject}</div>
                      <div style={{fontSize:14,lineHeight:1.85,color:'var(--text)',whiteSpace:'pre-wrap'}}>{output}</div>
                    </div>
                  ):null}
                </div>
                {output&&(
                  <div style={{display:'flex',gap:16,alignItems:'center',padding:'12px 20px',borderTop:'1px solid var(--border)',background:'var(--surface-2)'}}>
                    <span style={{fontSize:11,color:'var(--text-3)'}}><strong style={{color:'var(--text)'}}>{output.split(/\s+/).filter(Boolean).length}</strong> words</span>
                    <span style={{fontSize:11,color:'var(--text-3)'}}><strong style={{color:'var(--text)'}}>{output.length}</strong> chars</span>
                    <span style={{display:'inline-flex',alignItems:'center',background:'#f0fdf4',border:'1px solid #bbf7d0',borderRadius:6,padding:'3px 10px',fontSize:11,fontWeight:700,color:'#16a34a'}}>{rates[angle]} avg reply rate</span>
                  </div>
                )}
              </div>
              <div style={{display:'flex',justifyContent:'space-between',alignItems:'center'}}>
                <button onClick={()=>setStep(2)} style={{background:'none',border:'1.5px solid var(--border-2)',color:'var(--text-2)',padding:'10px 20px',borderRadius:10,fontSize:13,fontWeight:600,cursor:'pointer',fontFamily:"'Sora',sans-serif"}}>&#8592; Edit angle</button>
                <button onClick={()=>{setStep(1);setOutput('');setSubject('');setContactName('');setContactFirm('');setContactRole('');setContactSchool('');setCtx('');}} style={{background:'var(--text)',color:'var(--surface)',padding:'10px 28px',borderRadius:10,fontSize:13,fontWeight:700,cursor:'pointer',border:'none',fontFamily:"'Sora',sans-serif",display:'inline-flex',alignItems:'center',gap:8}}>
                  <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M12 5v14M5 12h14"/></svg>
                  New Email
                </button>
              </div>
            </div>
          )}
        </div>
      </main>

      {/* ═══ SAVED DRAFTS DRAWER ═══ */}
      <div style={{ position: 'fixed', right: 0, top: 0, bottom: 0, width: 400, background: 'var(--surface)', borderLeft: '1.5px solid var(--border)', zIndex: 50, transform: showSaved ? 'translateX(0)' : 'translateX(100%)', transition: 'transform .28s ease', display: 'flex', flexDirection: 'column', boxShadow: '-4px 0 32px rgba(0,0,0,.07)' }}>
        <div style={{ padding: '18px 20px', borderBottom: '1px solid var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <svg width="16" height="16" fill="none" stroke="var(--text)" strokeWidth="2" viewBox="0 0 24 24"><path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"/><polyline points="17 21 17 13 7 13 7 21"/></svg>
            <span style={{ fontSize: 15, fontWeight: 700, color: 'var(--text)' }}>Saved Drafts</span>
            <span style={{ fontSize: 10, fontWeight: 700, background: 'var(--surface-2)', color: 'var(--text-3)', padding: '2px 8px', borderRadius: 100 }}>{savedMsgs.length}</span>
          </div>
          <button onClick={() => setShowSaved(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: 22, color: 'var(--text-3)', lineHeight: 1 }} type="button">&times;</button>
        </div>
        <div style={{ flex: 1, overflowY: 'auto', padding: '16px 20px' }}>
          {savedMsgs.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '48px 16px', color: 'var(--text-3)' }}>
              <div style={{ fontFamily: "'Instrument Serif', serif", fontSize: 18, fontStyle: 'italic', color: 'var(--text)', marginBottom: 6 }}>No saved drafts</div>
              <div style={{ fontSize: 12, lineHeight: 1.5 }}>Generate a message and click "Save Draft" to keep it here.</div>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {savedMsgs.map(m => {
                const isExpanded = expandedDraft === m.id;
                return (
                <div key={m.id} style={{ background: 'var(--bg)', border: '1.5px solid var(--border)', borderRadius: 12, overflow: 'hidden', transition: 'border-color 0.15s' }}
                  onMouseEnter={e => (e.currentTarget.style.borderColor = 'var(--text-3)')}
                  onMouseLeave={e => (e.currentTarget.style.borderColor = 'var(--border)')}>
                  {/* Clickable header */}
                  <div onClick={() => setExpandedDraft(isExpanded ? null : m.id)} style={{ padding: '16px 18px', cursor: 'pointer' }}>
                    <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 12, marginBottom: 8 }}>
                      <div style={{ minWidth: 0 }}>
                        <div style={{ fontSize: 14, fontWeight: 700, color: 'var(--text)', marginBottom: 2 }}>{m.contact}</div>
                        <div style={{ fontSize: 11, color: 'var(--text-3)' }}>{m.firm} &middot; {m.angle}</div>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexShrink: 0 }}>
                        <span style={{ fontSize: 10, color: 'var(--text-3)', marginTop: 2 }}>{new Date(m.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</span>
                        <svg width="12" height="12" fill="none" stroke="var(--text-3)" strokeWidth="2" viewBox="0 0 24 24" style={{ transition: 'transform 0.2s', transform: isExpanded ? 'rotate(180deg)' : 'rotate(0)' }}><polyline points="6 9 12 15 18 9"/></svg>
                      </div>
                    </div>
                    <div style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-2)' }}>Subject: {m.subject}</div>
                    {!isExpanded && (
                      <div style={{ fontSize: 12, color: 'var(--text-3)', lineHeight: 1.55, marginTop: 6, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' as const, overflow: 'hidden' }}>{m.body}</div>
                    )}
                  </div>
                  {/* Expanded body */}
                  {isExpanded && (
                    <div style={{ padding: '0 18px 16px' }}>
                      <div style={{ fontSize: 13, color: 'var(--text)', lineHeight: 1.75, whiteSpace: 'pre-wrap', padding: '14px 16px', background: 'var(--surface)', borderRadius: 10, border: '1px solid var(--border)', marginBottom: 12 }}>{m.body}</div>
                      <div style={{ display: 'flex', gap: 6 }}>
                        <button onClick={() => { navigator.clipboard.writeText(`Subject: ${m.subject}\n\n${m.body}`); showToast('Copied!'); }} type="button" style={{ flex: 1, padding: '8px 12px', borderRadius: 8, fontSize: 11, fontWeight: 600, cursor: 'pointer', fontFamily: "'Sora',sans-serif", background: 'var(--text)', color: 'var(--surface)', border: 'none' }}>Copy Full Message</button>
                        <button onClick={() => deleteSavedMsg(m.id)} type="button" style={{ padding: '8px 12px', borderRadius: 8, fontSize: 11, fontWeight: 600, cursor: 'pointer', fontFamily: "'Sora',sans-serif", background: 'none', color: '#dc2626', border: '1.5px solid #fecaca' }}>Delete</button>
                      </div>
                    </div>
                  )}
                </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
      {showSaved && <div onClick={() => setShowSaved(false)} style={{ position: 'fixed', inset: 0, zIndex: 40, background: 'rgba(0,0,0,0.15)' }} />}

      <div style={{position:'fixed',bottom:28,left:'50%',transform:`translateX(-50%) translateY(${toast?'0':'80px'})`,background:'var(--text)',color:'var(--surface)',padding:'10px 20px',borderRadius:100,fontSize:13,fontWeight:600,zIndex:300,transition:'transform .3s ease',pointerEvents:'none',whiteSpace:'nowrap'}}>{toast}</div>
    </div>
  );
}
