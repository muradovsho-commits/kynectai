'use client';
import Sidebar from "../components/Sidebar";
import React, { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import '../contact-finder/contact-finder.css';

type PipelineItem = {
  id: string;
  company: string;
  role: string;
  contact?: string;
  stage: string;
  date: string;
  notes?: string;
};

const STAGES = [
  { id: 'outreach', label: 'Outreach Sent', color: '#6366f1', icon: '📤' },
  { id: 'coffee_chat', label: 'Coffee Chat', color: '#8b5cf6', icon: '☕' },
  { id: 'interview', label: 'Interview', color: '#f59e0b', icon: '🎯' },
  { id: 'offer', label: 'Offer', color: '#16a34a', icon: '🔔' },
];

function BellAnimation({ onDone }: { onDone: () => void }) {
  useEffect(() => { const t = setTimeout(onDone, 3500); return () => clearTimeout(t); }, [onDone]);
  return (
    <div style={{position:'fixed',inset:0,zIndex:99999,display:'flex',alignItems:'center',justifyContent:'center',background:'rgba(0,0,0,0.6)',backdropFilter:'blur(8px)',animation:'fadeIn 0.3s ease'}}>
      <div style={{textAlign:'center',animation:'bellBounce 0.6s ease'}}>
        <div style={{fontSize:'120px',lineHeight:1,marginBottom:'16px',animation:'bellSwing 0.8s ease-in-out 0.3s'}}>🔔</div>
        <div style={{fontFamily:"'Instrument Serif', serif",fontSize:'42px',color:'#fff',marginBottom:'8px'}}>Offer Secured!</div>
        <div style={{fontSize:'16px',color:'rgba(255,255,255,0.7)'}}>Ring the bell. You earned this.</div>
        <div style={{marginTop:'24px'}}>
          {['🎉','✨','🎊','⭐','🏆'].map((e,i) => (
            <span key={i} style={{fontSize:'32px',margin:'0 8px',display:'inline-block',animation:`confettiFall 1s ease ${0.2+i*0.15}s both`}}>{e}</span>
          ))}
        </div>
      </div>
      <style>{`
        @keyframes fadeIn { from { opacity:0 } to { opacity:1 } }
        @keyframes bellBounce { 0% { transform:scale(0.3);opacity:0 } 50% { transform:scale(1.1) } 100% { transform:scale(1);opacity:1 } }
        @keyframes bellSwing { 0%,100% { transform:rotate(0) } 25% { transform:rotate(15deg) } 75% { transform:rotate(-15deg) } }
        @keyframes confettiFall { 0% { transform:translateY(-40px) scale(0);opacity:0 } 100% { transform:translateY(0) scale(1);opacity:1 } }
      `}</style>
    </div>
  );
}

export default function OfferPipelinePage() {
  const router = useRouter();
  const [items, setItems] = useState<PipelineItem[]>([]);
  const [showBell, setShowBell] = useState(false);
  const [showAdd, setShowAdd] = useState(false);
  const [editItem, setEditItem] = useState<PipelineItem | null>(null);
  const [form, setForm] = useState({ company: '', role: '', contact: '', stage: 'outreach', notes: '' });

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const s = window.localStorage.getItem('offerbell_user_id');
    if (!s) { router.replace('/signin'); return; }
    const theme = localStorage.getItem('offerbell-theme');
    if (theme === 'dark') document.documentElement.setAttribute('data-theme', 'dark');
    try {
      const saved = localStorage.getItem('offerbell_pipeline');
      if (saved) setItems(JSON.parse(saved));
    } catch {}
  }, [router]);

  const save = (newItems: PipelineItem[]) => { setItems(newItems); localStorage.setItem('offerbell_pipeline', JSON.stringify(newItems)); };

  const addItem = () => {
    if (!form.company.trim()) return;
    const newItem: PipelineItem = { id: Date.now().toString(), company: form.company, role: form.role, contact: form.contact, stage: form.stage, date: new Date().toISOString().slice(0,10), notes: form.notes };
    const newItems = [...items, newItem];
    save(newItems);
    if (form.stage === 'offer') setShowBell(true);
    setForm({ company: '', role: '', contact: '', stage: 'outreach', notes: '' });
    setShowAdd(false);
    // Track activity for streaks
    try { const today = new Date().toISOString().slice(0,10); const streakData = JSON.parse(localStorage.getItem('offerbell_activity') || '{}'); streakData[today] = (streakData[today] || 0) + 1; localStorage.setItem('offerbell_activity', JSON.stringify(streakData)); } catch {}
  };

  const moveStage = (id: string, newStage: string) => {
    const newItems = items.map(i => i.id === id ? { ...i, stage: newStage, date: new Date().toISOString().slice(0,10) } : i);
    save(newItems);
    if (newStage === 'offer') setShowBell(true);
  };

  const removeItem = (id: string) => { save(items.filter(i => i.id !== id)); };

  const stageItems = (stageId: string) => items.filter(i => i.stage === stageId);
  const totalOffers = items.filter(i => i.stage === 'offer').length;

  return (
    <div className="app">
      <Sidebar activePage="offer-pipeline" />
      {showBell && <BellAnimation onDone={() => setShowBell(false)} />}
      <main className="main">
        <div style={{maxWidth:'1100px',margin:'0 auto',padding:'0 16px'}}>
          {/* Header */}
          <div style={{display:'flex',justifyContent:'space-between',alignItems:'flex-start',marginBottom:'28px',flexWrap:'wrap',gap:'16px'}}>
            <div>
              <h1 style={{fontFamily:"'Instrument Serif', serif",fontSize:'28px',color:'var(--text)',margin:0}}>Offer Pipeline</h1>
              <p style={{fontSize:'14px',color:'var(--text-3)',marginTop:'6px'}}>Track every interaction from first outreach to signed offer.</p>
            </div>
            <div style={{display:'flex',gap:'12px',alignItems:'center'}}>
              {totalOffers > 0 && (
                <div style={{background:'linear-gradient(135deg,#16a34a,#15803d)',color:'#fff',padding:'8px 16px',borderRadius:'10px',fontSize:'13px',fontWeight:700,display:'flex',alignItems:'center',gap:'6px'}}>
                  🔔 {totalOffers} Offer{totalOffers !== 1 ? 's' : ''} Secured
                </div>
              )}
              <button onClick={() => setShowAdd(true)} style={{background:'var(--accent)',color:'#fff',border:'none',borderRadius:'10px',padding:'10px 20px',fontSize:'13px',fontWeight:600,cursor:'pointer',fontFamily:"'Sora',sans-serif"}}>+ Add Entry</button>
            </div>
          </div>

          {/* Stats Bar */}
          <div style={{display:'grid',gridTemplateColumns:'repeat(4,1fr)',gap:'12px',marginBottom:'24px'}}>
            {STAGES.map(s => {
              const count = stageItems(s.id).length;
              return (
                <div key={s.id} style={{background:'var(--surface)',border:'1.5px solid var(--border)',borderRadius:'12px',padding:'16px 20px',textAlign:'center'}}>
                  <div style={{fontSize:'28px',fontWeight:700,color:s.color,fontFamily:"'Instrument Serif', serif"}}>{count}</div>
                  <div style={{fontSize:'11px',color:'var(--text-3)',fontWeight:600,textTransform:'uppercase',letterSpacing:'0.5px',marginTop:'4px'}}>{s.label}</div>
                </div>
              );
            })}
          </div>

          {/* Pipeline Columns */}
          <div style={{display:'grid',gridTemplateColumns:'repeat(4,1fr)',gap:'12px',minHeight:'400px'}}>
            {STAGES.map(stage => (
              <div key={stage.id} style={{background:'var(--surface)',border:'1.5px solid var(--border)',borderRadius:'14px',padding:'16px',minHeight:'300px'}}>
                <div style={{display:'flex',alignItems:'center',gap:'8px',marginBottom:'16px',paddingBottom:'12px',borderBottom:'1px solid var(--border)'}}>
                  <span style={{fontSize:'18px'}}>{stage.icon}</span>
                  <span style={{fontSize:'13px',fontWeight:700,color:'var(--text)',letterSpacing:'0.3px'}}>{stage.label}</span>
                  <span style={{fontSize:'11px',color:'var(--text-3)',background:'var(--surface-2)',padding:'2px 8px',borderRadius:'8px',marginLeft:'auto'}}>{stageItems(stage.id).length}</span>
                </div>
                <div style={{display:'flex',flexDirection:'column',gap:'8px'}}>
                  {stageItems(stage.id).map(item => (
                    <div key={item.id} style={{background:'var(--bg)',border:'1px solid var(--border)',borderRadius:'10px',padding:'12px',position:'relative'}}>
                      <div style={{fontSize:'13px',fontWeight:700,color:'var(--text)'}}>{item.company}</div>
                      {item.role && <div style={{fontSize:'11px',color:'var(--text-2)',marginTop:'2px'}}>{item.role}</div>}
                      {item.contact && <div style={{fontSize:'11px',color:'var(--text-3)',marginTop:'2px'}}>↳ {item.contact}</div>}
                      <div style={{fontSize:'10px',color:'var(--text-3)',marginTop:'6px'}}>{item.date}</div>
                      <div style={{display:'flex',gap:'4px',marginTop:'8px',flexWrap:'wrap'}}>
                        {STAGES.filter(s => s.id !== stage.id).map(s => (
                          <button key={s.id} onClick={() => moveStage(item.id, s.id)} style={{fontSize:'10px',padding:'3px 8px',borderRadius:'6px',border:'1px solid var(--border)',background:'var(--surface)',color:'var(--text-2)',cursor:'pointer',fontFamily:"'Sora',sans-serif"}}>→ {s.label}</button>
                        ))}
                        <button onClick={() => removeItem(item.id)} style={{fontSize:'10px',padding:'3px 8px',borderRadius:'6px',border:'1px solid var(--border)',background:'var(--surface)',color:'#ef4444',cursor:'pointer',marginLeft:'auto',fontFamily:"'Sora',sans-serif"}}>✕</button>
                      </div>
                    </div>
                  ))}
                  {stageItems(stage.id).length === 0 && (
                    <div style={{fontSize:'12px',color:'var(--text-3)',textAlign:'center',padding:'20px 0',opacity:0.6}}>No entries yet</div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Add Modal */}
        {showAdd && (
          <div style={{position:'fixed',inset:0,zIndex:9999,display:'flex',alignItems:'center',justifyContent:'center',background:'rgba(0,0,0,0.5)',backdropFilter:'blur(4px)'}} onClick={() => setShowAdd(false)}>
            <div onClick={e => e.stopPropagation()} style={{background:'var(--surface)',border:'1.5px solid var(--border)',borderRadius:'16px',padding:'28px 32px',width:'420px',maxWidth:'90vw'}}>
              <h3 style={{fontFamily:"'Instrument Serif', serif",fontSize:'20px',color:'var(--text)',margin:'0 0 20px'}}>Add Pipeline Entry</h3>
              <div style={{display:'flex',flexDirection:'column',gap:'12px'}}>
                <input placeholder="Company (e.g., Goldman Sachs)" value={form.company} onChange={e => setForm({...form, company: e.target.value})} style={{padding:'10px 14px',borderRadius:'8px',border:'1.5px solid var(--border)',background:'var(--bg)',color:'var(--text)',fontSize:'13px',fontFamily:"'Sora',sans-serif"}} />
                <input placeholder="Role (e.g., IB Summer Analyst)" value={form.role} onChange={e => setForm({...form, role: e.target.value})} style={{padding:'10px 14px',borderRadius:'8px',border:'1.5px solid var(--border)',background:'var(--bg)',color:'var(--text)',fontSize:'13px',fontFamily:"'Sora',sans-serif"}} />
                <input placeholder="Contact name (optional)" value={form.contact} onChange={e => setForm({...form, contact: e.target.value})} style={{padding:'10px 14px',borderRadius:'8px',border:'1.5px solid var(--border)',background:'var(--bg)',color:'var(--text)',fontSize:'13px',fontFamily:"'Sora',sans-serif"}} />
                <select value={form.stage} onChange={e => setForm({...form, stage: e.target.value})} style={{padding:'10px 14px',borderRadius:'8px',border:'1.5px solid var(--border)',background:'var(--bg)',color:'var(--text)',fontSize:'13px',fontFamily:"'Sora',sans-serif"}}>
                  {STAGES.map(s => <option key={s.id} value={s.id}>{s.label}</option>)}
                </select>
                <textarea placeholder="Notes (optional)" value={form.notes} onChange={e => setForm({...form, notes: e.target.value})} rows={2} style={{padding:'10px 14px',borderRadius:'8px',border:'1.5px solid var(--border)',background:'var(--bg)',color:'var(--text)',fontSize:'13px',fontFamily:"'Sora',sans-serif",resize:'vertical'}} />
                <div style={{display:'flex',gap:'10px',marginTop:'4px'}}>
                  <button onClick={() => setShowAdd(false)} style={{flex:1,padding:'10px',borderRadius:'8px',border:'1.5px solid var(--border)',background:'var(--surface)',color:'var(--text-2)',fontSize:'13px',fontWeight:600,cursor:'pointer',fontFamily:"'Sora',sans-serif"}}>Cancel</button>
                  <button onClick={addItem} style={{flex:1,padding:'10px',borderRadius:'8px',border:'none',background:'var(--accent)',color:'#fff',fontSize:'13px',fontWeight:600,cursor:'pointer',fontFamily:"'Sora',sans-serif"}}>Add to Pipeline</button>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
