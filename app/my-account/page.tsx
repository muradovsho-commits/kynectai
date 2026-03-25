'use client';

import Sidebar from "../components/Sidebar";
import TutorialOverlay from "../components/TutorialOverlay";
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useMutation } from 'convex/react';
import { api } from '../../convex/_generated/api';
import { useRouter } from 'next/navigation';
import '../contact-finder/contact-finder.css';

const SCHOOLS = ["Adelphi University","American University","Appalachian State University","Arizona State University","Auburn University","Babson College","Baruch College","Baylor University","Bentley University","Binghamton University","Boston College","Boston University","Bridgewater State University","Brigham Young University","Brown University","Bryant University","Bucknell University","Carnegie Mellon University","Case Western Reserve University","Catholic University of America","Champlain College","Christopher Newport University","Clark University","Clemson University","Colgate University","Columbia University","Cornell University","Creighton University","Dartmouth College","DePaul University","Dickinson College","Drexel University","Duke University","East Carolina University","Elizabethtown College","Elon University","Emerson College","Emory University","Fairfield University","Fairleigh Dickinson University","Fashion Institute of Technology","Florida International University","Florida State University","Fordham University","Franklin & Marshall College","George Mason University","George Washington University","Georgetown University","Georgia Institute of Technology","Gettysburg College","Hamilton College","Harvard University","High Point University","Hofstra University","Hobart and William Smith Colleges","Howard University","Indiana University","Iona University","Iowa State University","Ithaca College","James Madison University","Johns Hopkins University","Johnson & Wales University","Kansas State University","Kean University","King's College PA","La Selle University","Lafayette College","Lehigh University","Liberty University","Long Island University","Longwood University","Louisiana State University","Loyola University Chicago","Loyola University Maryland","Manhattan College","Marist College","Marquette University","Massachusetts Institute of Technology","Merrimack College","Miami University of Ohio","Middlebury College","Misericordia University","Mississippi State University","Monmouth University","Montana State University","Montclair State University","Moravian University","Muhlenberg College","NC State University","New York University","Northeastern University","Northwestern University","Norwich University","Ohio State University","Ohio University","Oklahoma State University","Old Dominion University","Oregon State University","Pace University","Penn State University","Princeton University","Providence College","Purdue University","Quinnipiac University","Radford University","Ramapo College","Rensselaer Polytechnic Institute","Rice University","Rider University","Rochester Institute of Technology","Roger Williams University","Rowan University","Rutgers University","Sacred Heart University","Saint Anselm College","Saint Francis University PA","Saint Joseph's University","Salve Regina University","Seton Hall University","Simmons University","Skidmore College","Slippery Rock University","Southern Methodist University","St. Lawrence University","Stanford University","Stockton University","Stony Brook University","Suffolk University","Susquehanna University","Syracuse University","Temple University","Texas A&M University","Texas Christian University","Texas Tech University","The College of New Jersey","The New School","Towson University","Tufts University","Tulane University","UMass Boston","UMass Dartmouth","UMass Lowell","UNC Charlotte","UCLA","Union College","University at Albany","University at Buffalo","University of Alabama","University of Arizona","University of Arkansas","University of Baltimore","University of California Berkeley","University of Cincinnati","University of Colorado Boulder","University of Connecticut","University of Central Florida","University of Delaware","University of Florida","University of Georgia","University of Houston","University of Idaho","University of Illinois Urbana-Champaign","University of Iowa","University of Kansas","University of Kentucky","University of Louisville","University of Maryland","University of Massachusetts Amherst","University of Memphis","University of Miami","University of Michigan","University of Minnesota","University of Mississippi","University of Missouri","University of Montana","University of Nebraska","University of Nevada Las Vegas","University of Nevada Reno","University of New Hampshire","University of New Mexico","University of North Carolina at Chapel Hill","University of North Texas","University of Notre Dame","University of Oklahoma","University of Oregon","University of Pennsylvania","University of Pittsburgh","University of Rhode Island","University of Richmond","University of Rochester","University of South Carolina","University of South Florida","University of Southern California","University of Tennessee","University of Texas at Austin","University of Tulsa","University of Utah","University of Vermont","University of Virginia","University of Washington","University of Wisconsin Madison","University of Wyoming","Vanderbilt University","Villanova University","Virginia Commonwealth University","Virginia Tech","Wake Forest University","Washington University in St. Louis","Wheaton College MA","Wichita State University","Widener University","Wilkes University","William & Mary","Worcester Polytechnic Institute","Yale University"];

const VERTICALS = ["Investment Banking","Private Equity","Hedge Fund","Quantitative Research / Quant Trading","Venture Capital","Growth Equity","Sales & Trading","Equity Research","Asset Management","Consulting","Accounting / Audit / Tax","Corporate Finance / FP&A","Corporate Development","Real Estate","Credit / Debt","Restructuring","Family Office","Endowment / Pension"];

const YEARS = ["Class of 2025","Class of 2026","Class of 2027","Class of 2028","Class of 2029","Class of 2030"];

export default function MyAccountPage() {
  const router = useRouter();
  const deleteAccountMutation = useMutation((api as any).auth?.deleteAccount);
  const downgradePlanMutation = useMutation((api as any).auth?.downgradePlan);
  const [isDark, setIsDark] = useState(false);
  const [dirty, setDirty] = useState(false);
  const [saved, setSaved] = useState(false);
  const [showTutorial, setShowTutorial] = useState(false);
  const [tutorialStep, setTutorialStep] = useState(0);
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [school, setSchool] = useState('New York University');
  const [year, setYear] = useState('Class of 2026');
  const [targetRole, setTargetRole] = useState('Investment Banking');
  const [notifs, setNotifs] = useState({ usage: true, jobs: true, followup: false, updates: true });
  const [barsAnimated, setBarsAnimated] = useState(false);
  const [searchesUsed, setSearchesUsed] = useState(0);
  const [messagesUsed, setMessagesUsed] = useState(0);
  const [contactsTracked, setContactsTracked] = useState(0);
  const [userPlan, setUserPlan] = useState('free');
  const [planActivatedAt, setPlanActivatedAt] = useState<number | null>(null);
  const [promoCode, setPromoCode] = useState<string | null>(null);

  // Tutorial check
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const complete = localStorage.getItem('offerbell_tutorial_complete');
    if (!complete) {
      const step = parseInt(localStorage.getItem('offerbell_tutorial_step') || '0', 10);
      setTutorialStep(step);
      setShowTutorial(true);
    }
  }, []);

  useEffect(() => {
    const t = localStorage.getItem('offerbell-theme');
    if (t === 'dark') { document.documentElement.setAttribute('data-theme', 'dark'); setIsDark(true); }
    setTimeout(() => setBarsAnimated(true), 200);

    // Load real usage data
    try { setSearchesUsed(parseInt(localStorage.getItem('offerbell_searches_used') || '0', 10)); } catch {}
    try { setMessagesUsed(parseInt(localStorage.getItem('offerbell_messages_sent') || '0', 10)); } catch {}
    try { const t = localStorage.getItem('offerbell_tracker_v3'); if (t) setContactsTracked(JSON.parse(t).length); } catch {}
    try { const plan = localStorage.getItem('offerbell_plan') || 'free'; const prof = JSON.parse(localStorage.getItem('offerbell_onboarding_profile') || '{}'); setUserPlan(prof.plan || plan); } catch {}
    try { const at = localStorage.getItem('offerbell_plan_activated_at'); if (at) setPlanActivatedAt(parseInt(at, 10)); } catch {}
    try { const pc = localStorage.getItem('offerbell_promo_code'); if (pc) setPromoCode(pc); } catch {}

    // Load profile from onboarding localStorage
    try {
      const raw = localStorage.getItem('offerbell_onboarding_profile');
      if (raw) {
        const profile = JSON.parse(raw);
        setFirstName(profile.firstName || '');
        setLastName(profile.lastName || '');
        setEmail(profile.email || '');
        if (profile.university && SCHOOLS.includes(profile.university)) {
          setSchool(profile.university);
        }
        // Map onboarding "year" field (e.g. "2026") to display format "Class of 2026"
        if (profile.year) {
          const classOf = profile.year.startsWith('Class of') ? profile.year : `Class of ${profile.year}`;
          if (YEARS.includes(classOf)) setYear(classOf);
        }
        // targetRoles is an array in onboarding; use first one if it matches
        if (profile.targetRoles && Array.isArray(profile.targetRoles) && profile.targetRoles.length > 0) {
          const first = profile.targetRoles[0];
          if (VERTICALS.includes(first)) setTargetRole(first);
        }
      }
    } catch (e) {}
  }, []);

  function toggleTheme() {
    const next = isDark ? 'light' : 'dark';
    document.documentElement.setAttribute('data-theme', next);
    setIsDark(!isDark);
    localStorage.setItem('offerbell-theme', next);
  }

  function mark() { setDirty(true); setSaved(false); }

  function saveChanges() {
    // Write back to offerbell_onboarding_profile
    try {
      const raw = localStorage.getItem('offerbell_onboarding_profile');
      const existing = raw ? JSON.parse(raw) : {};
      const updated = {
        ...existing,
        firstName,
        lastName,
        email,
        university: school,
        year: year.replace('Class of ', ''),
        targetRoles: [targetRole, ...(existing.targetRoles || []).filter((r: string) => r !== targetRole)],
      };
      localStorage.setItem('offerbell_onboarding_profile', JSON.stringify(updated));
    } catch (e) {}

    setDirty(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  }

  const initials = ((firstName[0] || '') + (lastName[0] || '')).toUpperCase();
  const inp = { padding:'10px 14px', border:'1.5px solid var(--border-2)', borderRadius:10, fontSize:13, fontFamily:"'Sora',sans-serif", color:'var(--text)', background:'var(--bg)', outline:'none', width:'100%' } as React.CSSProperties;

  return (
    <div className="app">
      <Sidebar activePage="my-account" />

      <main className="main" style={{padding:'32px 36px'}}>

        {/* Profile Header */}
        <div style={{display:'flex',alignItems:'flex-start',gap:20,marginBottom:32,paddingBottom:32,borderBottom:'1px solid var(--border)'}}>
          <div style={{width:72,height:72,borderRadius:'50%',background:'var(--text)',color:'var(--surface)',fontSize:22,fontWeight:700,display:'flex',alignItems:'center',justifyContent:'center',fontFamily:"'Instrument Serif',serif",flexShrink:0}}>{initials}</div>
          <div style={{flex:1}}>
            <div style={{fontFamily:"'Instrument Serif',serif",fontSize:26,letterSpacing:'-.3px',color:'var(--text)',marginBottom:3}}>{firstName} <em style={{fontStyle:'italic'}}>{lastName}</em></div>
            <div style={{fontSize:13,color:'var(--text-3)',marginBottom:10}}>{email}</div>
            <div style={{display:'flex',gap:6,flexWrap:'wrap'}}>
              {userPlan === 'pro' ? (
                <span style={{display:'inline-flex',padding:'3px 10px',borderRadius:100,fontSize:11,fontWeight:600,background:'#ecfdf5',color:'#166534',border:'1px solid #bbf7d0'}}>Pro Plan</span>
              ) : (
                <span style={{display:'inline-flex',padding:'3px 10px',borderRadius:100,fontSize:11,fontWeight:600,background:'#fef3c7',color:'#92400e',border:'1px solid #fde68a'}}>Free Plan</span>
              )}
              <span style={{display:'inline-flex',padding:'3px 10px',borderRadius:100,fontSize:11,fontWeight:600,background:'var(--surface-2)',color:'var(--text-2)',border:'1px solid var(--border)'}}>{school}</span>
              <span style={{display:'inline-flex',padding:'3px 10px',borderRadius:100,fontSize:11,fontWeight:600,background:'var(--surface-2)',color:'var(--text-2)',border:'1px solid var(--border)'}}>{year}</span>
            </div>
          </div>
          <div style={{display:'flex',flexDirection:'column',gap:8,alignItems:'flex-end'}}>
            <button onClick={saveChanges} type="button" style={{background:'var(--text)',color:'var(--surface)',padding:'9px 20px',borderRadius:10,fontSize:13,fontWeight:700,border:'none',cursor:'pointer',fontFamily:"'Sora',sans-serif"}}>Save Changes</button>
            <button type="button" onClick={() => { localStorage.removeItem('offerbell_user_id'); localStorage.removeItem('userId'); document.cookie = 'offerbell_user_id=; path=/; max-age=0'; router.push('/signin'); }} style={{background:'var(--surface)',color:'var(--text-2)',padding:'8px 20px',borderRadius:10,fontSize:13,fontWeight:600,border:'1.5px solid var(--border-2)',cursor:'pointer',fontFamily:"'Sora',sans-serif"}}>Sign Out</button>
          </div>
        </div>

        {/* Usage */}
        <div style={{marginBottom:28}}>
          <div style={{fontSize:13,fontWeight:700,color:'var(--text)',marginBottom:14,display:'flex',alignItems:'center',gap:8}}>This Month's Usage<div style={{flex:1,height:1,background:'var(--border)'}}/></div>
          <div style={{display:'grid',gridTemplateColumns:'repeat(3,1fr)',gap:12}}>
            {[
              {label:'Contact Finder',used:'—',total:'—',pct:0,color:'var(--text)',reset:'Coming Soon'},
              {label:'Outreach Messages',used:messagesUsed,total:userPlan === 'pro' ? 'unlimited' : '5',pct:userPlan === 'pro' ? 100 : Math.round(messagesUsed/5*100),color:'var(--text)',reset:userPlan === 'pro' ? 'Unlimited — Pro' : 'Resets next month'},
              {label:'Contacts Tracked',used:contactsTracked,total:'unlimited',pct:100,color:'#16a34a',reset:'No limit on tracking'},
            ].map(u=>(
              <div key={u.label} style={{background:'var(--surface)',border:'1.5px solid var(--border)',borderRadius:14,padding:'18px 20px'}}>
                <div style={{fontSize:11,fontWeight:600,color:'var(--text-3)',textTransform:'uppercase',letterSpacing:'.5px',marginBottom:10}}>{u.label}</div>
                <div style={{height:6,background:'var(--surface-2)',borderRadius:3,overflow:'hidden',marginBottom:8}}>
                  <div style={{height:'100%',borderRadius:3,background:u.color,width:barsAnimated?u.pct+'%':'0%',transition:'width 1s cubic-bezier(.4,0,.2,1)'}}/>
                </div>
                <div style={{display:'flex',justifyContent:'space-between',alignItems:'baseline'}}>
                  <div style={{fontSize:18,fontWeight:800,color:u.color,letterSpacing:'-.5px'}}>{u.used}</div>
                  <div style={{fontSize:11,color:'var(--text-3)'}}>of {u.total}</div>
                </div>
                <div style={{fontSize:11,color:'var(--text-3)',marginTop:4}}>{u.reset}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Profile Form */}
        <div data-tutorial="profile-section" style={{marginBottom:28}}>
          <div style={{fontSize:13,fontWeight:700,color:'var(--text)',marginBottom:14,display:'flex',alignItems:'center',gap:8}}>Profile<div style={{flex:1,height:1,background:'var(--border)'}}/></div>
          <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:14}}>
            <div style={{display:'flex',flexDirection:'column',gap:6}}>
              <label style={{fontSize:12,fontWeight:700,color:'var(--text)'}}>First name</label>
              <input style={inp} type="text" value={firstName} onChange={e=>{setFirstName(e.target.value);mark();}} placeholder="First name"/>
            </div>
            <div style={{display:'flex',flexDirection:'column',gap:6}}>
              <label style={{fontSize:12,fontWeight:700,color:'var(--text)'}}>Last name</label>
              <input style={inp} type="text" value={lastName} onChange={e=>{setLastName(e.target.value);mark();}} placeholder="Last name"/>
            </div>
            <div style={{display:'flex',flexDirection:'column',gap:6}}>
              <label style={{fontSize:12,fontWeight:700,color:'var(--text)'}}>Email</label>
              <input style={inp} type="email" value={email} onChange={e=>{setEmail(e.target.value);mark();}} placeholder="your@email.com"/>
            </div>
            <div style={{display:'flex',flexDirection:'column',gap:6}}>
              <label style={{fontSize:12,fontWeight:700,color:'var(--text)'}}>School</label>
              <select style={inp} value={school} onChange={e=>{setSchool(e.target.value);mark();}}>
                {SCHOOLS.map(s=><option key={s}>{s}</option>)}
              </select>
            </div>
            <div style={{display:'flex',flexDirection:'column',gap:6}}>
              <label style={{fontSize:12,fontWeight:700,color:'var(--text)'}}>Graduation Year</label>
              <select style={inp} value={year} onChange={e=>{setYear(e.target.value);mark();}}>
                {YEARS.map(y=><option key={y}>{y}</option>)}
              </select>
            </div>
            <div style={{display:'flex',flexDirection:'column',gap:6}}>
              <label style={{fontSize:12,fontWeight:700,color:'var(--text)'}}>Target Role</label>
              <select style={inp} value={targetRole} onChange={e=>{setTargetRole(e.target.value);mark();}}>
                {VERTICALS.map(v=><option key={v}>{v}</option>)}
              </select>
            </div>
          </div>
        </div>

        {/* Plan */}
        <div style={{marginBottom:28}}>
          <div style={{fontSize:13,fontWeight:700,color:'var(--text)',marginBottom:14,display:'flex',alignItems:'center',gap:8}}>Plan & Billing<div style={{flex:1,height:1,background:'var(--border)'}}/></div>
          {userPlan === 'pro' ? (
            <div style={{background:'var(--surface)',border:'1.5px solid var(--border)',borderRadius:14,padding:20,display:'flex',alignItems:'center',justifyContent:'space-between',gap:20}}>
              <div style={{display:'flex',alignItems:'center',gap:14}}>
                <div style={{width:44,height:44,borderRadius:12,background:'#166534',display:'flex',alignItems:'center',justifyContent:'center',flexShrink:0}}>
                  <svg width="20" height="20" fill="none" stroke="#fff" strokeWidth="2" viewBox="0 0 24 24"><path d="M12 2L2 7l10 5 10-5-10-5z"/><path d="M2 17l10 5 10-5"/><path d="M2 12l10 5 10-5"/></svg>
                </div>
                <div>
                  <div style={{fontSize:15,fontWeight:700,color:'var(--text)',marginBottom:2}}>Pro Plan</div>
                  <div style={{fontSize:12,color:'var(--text-3)'}}>Unlimited messages · all features unlocked</div>
                  <div style={{fontSize:11,color:'var(--text-3)',marginTop:4}}>
                    {(() => {
                      if (!planActivatedAt && !promoCode) return null;
                      const fmtDate = (ts: number) => new Date(ts).toLocaleDateString('en-US', { month:'long', day:'numeric', year:'numeric' });
                      // Promo code user
                      if (promoCode) {
                        const code = promoCode.toLowerCase();
                        // Lifetime / forever codes
                        if (code.includes('lifetime') || code.includes('forever') || code.includes('free')) {
                          return <>Lifetime Pro via code <strong>{promoCode}</strong> — no renewal needed</>;
                        }
                        // Codes with month numbers (e.g. "3MONTHFREE", "promo2mo")
                        const monthMatch = code.match(/(\d+)\s*(?:mo|month)/i);
                        if (monthMatch && planActivatedAt) {
                          const freeMonths = parseInt(monthMatch[1], 10);
                          const freeEnds = new Date(planActivatedAt + freeMonths * 30 * 24 * 60 * 60 * 1000);
                          const now = new Date();
                          if (now < freeEnds) {
                            return <>{freeMonths} months free via code <strong>{promoCode}</strong> · billing starts {fmtDate(freeEnds.getTime())}</>;
                          } else {
                            const renewDate = new Date(freeEnds.getTime() + 30 * 24 * 60 * 60 * 1000);
                            return <>Promo ended · Renews {fmtDate(renewDate.getTime())}</>;
                          }
                        }
                        // Generic promo — show code + standard renewal
                        if (planActivatedAt) {
                          return <>Activated via code <strong>{promoCode}</strong> · Renews {fmtDate(planActivatedAt + 30 * 24 * 60 * 60 * 1000)}</>;
                        }
                        return <>Activated via code <strong>{promoCode}</strong></>;
                      }
                      // Standard paid user
                      if (planActivatedAt) {
                        return <>Renews {fmtDate(planActivatedAt + 30 * 24 * 60 * 60 * 1000)}</>;
                      }
                      return null;
                    })()}
                  </div>
                </div>
              </div>
              <div style={{display:'flex',alignItems:'center',gap:16}}>
                <div style={{textAlign:'right'}}>
                  <div style={{fontFamily:"'Instrument Serif',serif",fontSize:24,fontStyle:'italic',color:'var(--text)',letterSpacing:'-.3px'}}>
                    {promoCode && (promoCode.toLowerCase().includes('lifetime') || promoCode.toLowerCase().includes('forever') || promoCode.toLowerCase().includes('free'))
                      ? <>$0 <span style={{fontSize:13,fontStyle:'normal',fontFamily:"'Sora',sans-serif",color:'var(--text-3)',fontWeight:400}}>/mo</span></>
                      : <>$20 <span style={{fontSize:13,fontStyle:'normal',fontFamily:"'Sora',sans-serif",color:'var(--text-3)',fontWeight:400}}>/mo</span></>
                    }
                  </div>
                  <div style={{fontSize:11,color:'#16a34a',marginTop:2,fontWeight:600}}>Active</div>
                </div>
                <button type="button" onClick={async () => { if (confirm('Are you sure you want to downgrade to the Free plan? You will lose access to Pro features.')) { try { const raw = localStorage.getItem('offerbell_onboarding_profile'); const existing = raw ? JSON.parse(raw) : {}; localStorage.setItem('offerbell_onboarding_profile', JSON.stringify({ ...existing, plan: 'free', planActivatedAt: undefined, promoCode: undefined, promoApplied: false })); localStorage.setItem('offerbell_plan', 'free'); localStorage.removeItem('offerbell_plan_activated_at'); localStorage.removeItem('offerbell_promo_code'); const userId = localStorage.getItem('offerbell_user_id'); if (userId && downgradePlanMutation) { await downgradePlanMutation({ userId }).catch(() => {}); } } catch {} window.location.reload(); }}} style={{background:'var(--surface)',color:'var(--text-2)',padding:'9px 20px',borderRadius:10,fontSize:13,fontWeight:600,border:'1.5px solid var(--border-2)',cursor:'pointer',fontFamily:"'Sora',sans-serif"}}>Downgrade</button>
              </div>
            </div>
          ) : (
            <div style={{background:'var(--surface)',border:'1.5px solid var(--border)',borderRadius:14,padding:20,display:'flex',alignItems:'center',justifyContent:'space-between',gap:20}}>
              <div style={{display:'flex',alignItems:'center',gap:14}}>
                <div style={{width:44,height:44,borderRadius:12,background:'var(--text)',display:'flex',alignItems:'center',justifyContent:'center',flexShrink:0}}>
                  <svg width="20" height="20" fill="none" stroke="var(--surface)" strokeWidth="2" viewBox="0 0 24 24"><path d="M12 2L2 7l10 5 10-5-10-5z"/><path d="M2 17l10 5 10-5"/><path d="M2 12l10 5 10-5"/></svg>
                </div>
                <div>
                  <div style={{fontSize:15,fontWeight:700,color:'var(--text)',marginBottom:2}}>Free Plan</div>
                  <div style={{fontSize:12,color:'var(--text-3)'}}>5 messages · unlimited tracking · Contact Finder coming soon</div>
                </div>
              </div>
              <div style={{display:'flex',alignItems:'center',gap:16}}>
                <div style={{textAlign:'right'}}>
                  <div style={{fontFamily:"'Instrument Serif',serif",fontSize:24,fontStyle:'italic',color:'var(--text)',letterSpacing:'-.3px'}}>$0 <span style={{fontSize:13,fontStyle:'normal',fontFamily:"'Sora',sans-serif",color:'var(--text-3)',fontWeight:400}}>/mo</span></div>
                  <div style={{fontSize:11,color:'var(--text-3)',marginTop:2}}>No card required</div>
                </div>
                <button type="button" onClick={() => window.location.href='/checkout'} style={{background:'#f59e0b',color:'#fff',padding:'9px 20px',borderRadius:10,fontSize:13,fontWeight:700,border:'none',cursor:'pointer',fontFamily:"'Sora',sans-serif"}}>Upgrade to Pro — $20/mo</button>
              </div>
            </div>
          )}
        </div>

        {/* Notifications */}
        <div style={{marginBottom:28}}>
          <div style={{fontSize:13,fontWeight:700,color:'var(--text)',marginBottom:14,display:'flex',alignItems:'center',gap:8}}>Notifications<div style={{flex:1,height:1,background:'var(--border)'}}/></div>
          <div style={{background:'var(--surface)',border:'1.5px solid var(--border)',borderRadius:14,overflow:'hidden'}}>
            {([
              {key:'usage',label:'Usage reminders',sub:"Get notified when you're running low on searches or messages"},
              {key:'jobs',label:'New job listings',sub:'Weekly digest of new finance roles matching your target'},
              {key:'followup',label:'Follow-up reminders',sub:"Remind me when a contact hasn't heard from me in 7+ days"},
              {key:'updates',label:'Platform updates',sub:'New features, tips, and product announcements'},
            ] as {key:keyof typeof notifs,label:string,sub:string}[]).map((n,i)=>(
              <div key={n.key} style={{display:'flex',alignItems:'center',justifyContent:'space-between',padding:'14px 18px',borderBottom:i<3?'1px solid var(--border)':'none'}}>
                <div>
                  <div style={{fontSize:13,fontWeight:600,color:'var(--text)',marginBottom:2}}>{n.label}</div>
                  <div style={{fontSize:11,color:'var(--text-3)'}}>{n.sub}</div>
                </div>
                <button onClick={()=>{setNotifs(p=>({...p,[n.key]:!p[n.key]}));mark();}} type="button"
                  style={{width:36,height:20,borderRadius:100,background:notifs[n.key]?'var(--text)':'var(--border-2)',cursor:'pointer',position:'relative',border:'none',transition:'background .2s',flexShrink:0}}>
                  <div style={{width:14,height:14,borderRadius:'50%',background:'var(--surface)',position:'absolute',top:3,left:notifs[n.key]?19:3,transition:'left .2s',boxShadow:'0 1px 3px rgba(0,0,0,.15)'}}/>
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Support */}
        <div style={{marginBottom:28}}>
          <div style={{fontSize:13,fontWeight:700,color:'var(--text)',marginBottom:14,display:'flex',alignItems:'center',gap:8}}>Support<div style={{flex:1,height:1,background:'var(--border)'}}/></div>
          <div style={{background:'var(--surface)',border:'1.5px solid var(--border)',borderRadius:14,padding:20,display:'flex',alignItems:'center',justifyContent:'space-between',gap:20}}>
            <div>
              <div style={{fontSize:13,fontWeight:700,color:'var(--text)',marginBottom:3}}>Need help?</div>
              <div style={{fontSize:12,color:'var(--text-3)'}}>Reach out to our team for questions, feedback, or partnership inquiries.</div>
            </div>
            <a href="mailto:offerbell@gmail.com" style={{background:'var(--surface)',color:'var(--text)',padding:'8px 16px',borderRadius:9,fontSize:12,fontWeight:700,border:'1.5px solid var(--border-2)',cursor:'pointer',fontFamily:"'Sora',sans-serif",whiteSpace:'nowrap',textDecoration:'none'}}>offerbell@gmail.com</a>
          </div>
        </div>

        {/* Danger Zone */}
        <div style={{marginBottom:28}}>
          <div style={{fontSize:13,fontWeight:700,color:'var(--text)',marginBottom:14,display:'flex',alignItems:'center',gap:8}}>Danger Zone<div style={{flex:1,height:1,background:'var(--border)'}}/></div>
          <div style={{display:'flex',flexDirection:'column',gap:10}}>
            {[
              {title:'Reset all data',desc:'Clear your outreach tracker, saved contacts, and message history. This cannot be undone.',action:() => { if (confirm('Are you sure? This will clear all your tracking data and cannot be undone.')) { localStorage.removeItem('offerbell_tracker_v3'); localStorage.setItem('offerbell_tracker_v3', '[]'); localStorage.removeItem('offerbell_searches_used'); localStorage.removeItem('offerbell_messages_sent'); localStorage.removeItem('offerbell_waitlist_joined'); localStorage.setItem('offerbell_tracker_seeded', 'true'); window.location.reload(); }}},
              {title:'Delete account',desc:'Permanently delete your account and all associated data.',action:async () => { if (confirm('Are you sure you want to delete your account? This is permanent and cannot be undone.')) { try { const uid = localStorage.getItem('offerbell_user_id'); if (uid) await deleteAccountMutation({ userId: uid }); } catch(e) { console.error(e); } localStorage.clear(); document.cookie = 'offerbell_user_id=; path=/; max-age=0'; router.push('/signin'); }}},
            ].map(d=>(
              <div key={d.title} style={{background:'var(--surface)',border:'1.5px solid var(--border)',borderRadius:14,padding:20,display:'flex',alignItems:'center',justifyContent:'space-between',gap:20}}>
                <div>
                  <div style={{fontSize:13,fontWeight:700,color:'#dc2626',marginBottom:3}}>{d.title}</div>
                  <div style={{fontSize:12,color:'var(--text-3)'}}>{d.desc}</div>
                </div>
                <button type="button" onClick={d.action} style={{background:'#fef2f2',color:'#dc2626',padding:'8px 16px',borderRadius:9,fontSize:12,fontWeight:700,border:'1.5px solid #fecaca',cursor:'pointer',fontFamily:"'Sora',sans-serif",whiteSpace:'nowrap'}}>{d.title}</button>
              </div>
            ))}
          </div>
        </div>

      </main>

      {/* Save bar */}
      <div style={{position:'fixed',bottom:24,left:'50%',transform:`translateX(-50%) translateY(${dirty||saved?'0':'80px'})`,background:'var(--text)',color:'var(--surface)',padding:'12px 24px',borderRadius:100,fontSize:13,fontWeight:600,zIndex:200,transition:'transform .3s ease',display:'flex',alignItems:'center',gap:12,boxShadow:'0 4px 24px rgba(0,0,0,.2)',whiteSpace:'nowrap'}}>
        {saved ? 'Saved!' : 'Changes unsaved'}
        {!saved && <button onClick={saveChanges} type="button" style={{background:'var(--surface)',color:'var(--text)',padding:'6px 16px',borderRadius:100,fontSize:12,fontWeight:700,border:'none',cursor:'pointer',fontFamily:"'Sora',sans-serif"}}>Save now</button>}
      </div>

      {showTutorial && (
        <TutorialOverlay
          userId={typeof window !== 'undefined' ? (localStorage.getItem('offerbell_user_id') || '') : ''}
          initialStep={tutorialStep}
          onComplete={() => setShowTutorial(false)}
        />
      )}
    </div>
  );
}
