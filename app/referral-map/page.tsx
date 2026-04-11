'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import Sidebar from '../components/Sidebar';
import '../contact-finder/contact-finder.css';
import './referral-map.css';
import { US_STATES } from './us-states';

type Contact = {
  id: string;
  name: string;
  firm: string;
  role: string;
  referredBy: string; // 'you' or contact id
  note: string;
  state?: string;
  chainLabel?: string; // user-defined label for chains rooted at this contact
  addedAt: number;
};

const SK = 'offerbell_referral_nodes_v3';
const TK = 'offerbell_tracker_v3';

const COLORS = ['#3b82f6','#8b5cf6','#ec4899','#f59e0b','#10b981','#ef4444','#06b6d4','#6366f1','#14b8a6','#e11d48'];
function getColor(name: string) { let h = 0; for (let i = 0; i < name.length; i++) h = name.charCodeAt(i) + ((h << 5) - h); return COLORS[Math.abs(h) % COLORS.length]; }
function getInitials(name: string) { return name.split(' ').filter(Boolean).map(w => w[0]).join('').toUpperCase().slice(0, 2) || '?'; }

function load(): Contact[] {
  try {
    const r = localStorage.getItem(SK);
    if (r) {
      const parsed = JSON.parse(r);
      return parsed.map((c: any) => ({ ...c, state: c.state || undefined }));
    }
    const v3 = localStorage.getItem('offerbell_referral_nodes_v3');
    if (v3) {
      return JSON.parse(v3).map((c: any) => ({ ...c, state: undefined }));
    }
  } catch {}
  return [];
}
function save(c: Contact[]) { localStorage.setItem(SK, JSON.stringify(c)); }

// ═══ NETWORK GRAPH COMPONENT ═══
function NetworkGraph({ contacts, selectedId, onSelect, expanded, searchQuery = '' }: { contacts: Contact[]; selectedId: string | null; onSelect: (id: string | null) => void; expanded: boolean; searchQuery?: string }) {
  const svgRef = useRef<SVGSVGElement>(null);
  
  // Use a fixed 1000x600 coordinate system for the elegant US Map layout
  const w = 1000;
  const h = 600;

  // Unassigned Hub (for contacts with no state)
  const UNASSIGNED_POS = { x: 880, y: 550 };
  const YOU_POS = { x: 500, y: 550 }; // Anchor 'you' at the bottom center below the map

  // Distribute contacts by state
  const stateAgg: Record<string, Contact[]> = {};
  contacts.forEach(c => {
    const st = c.state && US_STATES[c.state as keyof typeof US_STATES] ? c.state : 'UNASSIGNED';
    if (!stateAgg[st]) stateAgg[st] = [];
    stateAgg[st].push(c);
  });

  // Calculate nodes to render (one per state + unassigned + you)
  const nodes = [];
  const edges: { sourceId: string; targetId: string; x1: number; y1: number; x2: number; y2: number; count: number }[] = [];

  // "You" node
  nodes.push({ id: 'you', x: YOU_POS.x, y: YOU_POS.y, label: 'You', color: '#10b981', r: 24, count: 1 });

  // State nodes
  Object.keys(stateAgg).forEach(st => {
    if (st === 'UNASSIGNED') {
      nodes.push({ id: 'UNASSIGNED', x: UNASSIGNED_POS.x, y: UNASSIGNED_POS.y, label: 'Unmapped', color: '#4b5563', r: 18, count: stateAgg[st].length });
    } else {
      const sPos = US_STATES[st as keyof typeof US_STATES];
      nodes.push({ id: st, x: sPos.x, y: sPos.y, label: st, color: '#3b82f6', r: Math.min(30, 12 + stateAgg[st].length * 2), count: stateAgg[st].length });
    }
  });

  // Determine which contacts fall into search
  const query = searchQuery.toLowerCase();
  const searchMatches = new Set<string>();
  if (query) {
    contacts.forEach(c => {
      if (c.name.toLowerCase().includes(query) || c.firm.toLowerCase().includes(query)) {
        searchMatches.add(c.id);
        if (c.state && US_STATES[c.state as keyof typeof US_STATES]) searchMatches.add(c.state);
        else searchMatches.add('UNASSIGNED');
      }
    });
  }

  // Calculate Edges (Referrals)
  const getPos = (c: Contact | 'you') => {
    if (c === 'you') return YOU_POS;
    if (c.state && US_STATES[c.state as keyof typeof US_STATES]) return US_STATES[c.state as keyof typeof US_STATES];
    return UNASSIGNED_POS;
  };

  contacts.forEach(c => {
    const targetPos = getPos(c);
    const targetGroupId = c.state && US_STATES[c.state as keyof typeof US_STATES] ? c.state : 'UNASSIGNED';
    
    let sourcePos = YOU_POS;
    let sourceGroupId = 'you';

    if (c.referredBy !== 'you') {
      const parent = contacts.find(x => x.id === c.referredBy);
      if (parent) {
        sourcePos = getPos(parent);
        sourceGroupId = parent.state && US_STATES[parent.state as keyof typeof US_STATES] ? parent.state : 'UNASSIGNED';
      }
    }

    if (sourceGroupId !== targetGroupId) {
      // Find existing edge to increment count, or add new
      const ex = edges.find(e => e.sourceId === sourceGroupId && e.targetId === targetGroupId);
      if (ex) {
        ex.count++;
      } else {
        edges.push({ sourceId: sourceGroupId, targetId: targetGroupId, x1: sourcePos.x, y1: sourcePos.y, x2: targetPos.x, y2: targetPos.y, count: 1 });
      }
    }
  });
  
  // Create an aesthetic background mesh by connecting nearby states
  const meshLines: { x1: number; y1: number; x2: number; y2: number }[] = [];
  const stateKeys = Object.keys(US_STATES) as (keyof typeof US_STATES)[];
  stateKeys.forEach(s1 => {
    const p1 = US_STATES[s1];
    // Find closest 2-3 states
    const dists = stateKeys.filter(s => s !== s1).map(s => {
      const p2 = US_STATES[s];
      return { p2, d: Math.hypot(p1.x - p2.x, p1.y - p2.y) };
    }).sort((a, b) => a.d - b.d).slice(0, 3);
    dists.forEach(d => {
      meshLines.push({ x1: p1.x, y1: p1.y, x2: d.p2.x, y2: d.p2.y });
    });
  });

  return (
    <div style={{ width: '100%', height: expanded ? '100%' : '400px', display: 'flex', alignItems: 'center', justifyContent: 'center', perspective: '1200px', overflow: 'hidden' }}>
      <svg ref={svgRef} viewBox={`0 0 ${w} ${h}`} style={{ width: '100%', height: '100%', transform: 'rotateX(40deg) rotateZ(-5deg) scale(1.1)', transformStyle: 'preserve-3d', filter: 'drop-shadow(0 40px 30px rgba(0,0,0,0.5))' }}>
        <defs>
          <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="8" result="blur" />
          </filter>
          <filter id="glow-strong" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="12" result="blur" />
            <feComponentTransfer in="blur" result="glow">
              <feFuncA type="linear" slope="1.5" />
            </feComponentTransfer>
            <feMerge>
              <feMergeNode in="glow" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* Base Mesh Map connecting all US States lightly */}
        {meshLines.map((l, i) => (
          <line key={`m${i}`} x1={l.x1} y1={l.y1} x2={l.x2} y2={l.y2} stroke="rgba(255,255,255,0.05)" strokeWidth="1" />
        ))}

        {/* Unpopulated States */}
        {stateKeys.map(s => {
          if (nodes.find(n => n.id === s)) return null; // Drawn as active node
          const p = US_STATES[s];
          return <circle key={`e-${s}`} cx={p.x} cy={p.y} r={3} fill="rgba(255,255,255,0.15)" />;
        })}

        {/* Active Edges (Referral Arcs) */}
        {edges.map((e, i) => {
          // Quadratic bezier curve arc (rising up)
          const cx = (e.x1 + e.x2) / 2;
          const cy = (e.y1 + e.y2) / 2 - 100; // Arc upwards
          
          const isMatchPath = query && (searchMatches.has(e.sourceId) || searchMatches.has(e.targetId));
          const dimEdge = query && !isMatchPath;
          
          return (
            <g key={`e${i}`}>
              <path 
                d={`M ${e.x1} ${e.y1} Q ${cx} ${cy} ${e.x2} ${e.y2}`}
                fill="none"
                stroke={isMatchPath ? "#ffffff" : "rgba(59, 130, 246, 0.4)"} 
                strokeWidth={isMatchPath ? "3" : Math.min(e.count + 1, 6)} 
                opacity={dimEdge ? 0.05 : 1}
                strokeDasharray="4 4"
                style={{ transition: 'all 0.3s' }}
              />
              {isMatchPath && (
                <path 
                  d={`M ${e.x1} ${e.y1} Q ${cx} ${cy} ${e.x2} ${e.y2}`}
                  fill="none" stroke="#ffffff" strokeWidth="6" opacity="0.6" style={{ filter: 'url(#glow-strong)' }}
                />
              )}
            </g>
          );
        })}

        {/* Active Nodes */}
        {nodes.map((n, i) => {
          const isSelected = selectedId && (
            (n.id === 'you') || 
            (stateAgg[n.id]?.some(c => c.id === selectedId || c.chainLabel === selectedId))
          );
          const isMatch = !query || searchMatches.has(n.id);
          const opacity = isMatch ? 1 : 0.2;
          const isYou = n.id === 'you';

          return (
            <g key={n.id} style={{ cursor: isYou ? 'default' : 'pointer', transition: 'all 0.4s', opacity, transformOrigin: `${n.x}px ${n.y}px`, transform: isSelected ? 'scale(1.2) translateY(-10px)' : 'none' }}>
              {isMatch && <circle cx={n.x} cy={n.y} r={n.r + 6} fill={n.color} opacity="0.3" style={{ filter: 'url(#glow)' }} />}
              <circle cx={n.x} cy={n.y} r={n.r} fill={n.color} />
              <text x={n.x} y={n.y} textAnchor="middle" dominantBaseline="central" fill="#fff" fontSize={n.r > 16 ? 12 : 9} fontWeight="800" fontFamily="'Sora', sans-serif">
                {isYou ? 'You' : n.count}
              </text>
              <text x={n.x} y={n.y + n.r + 14} textAnchor="middle" fill="#9ca3af" fontSize="12" fontWeight="700" fontFamily="'Sora', sans-serif" style={{ textShadow: '0 2px 4px rgba(0,0,0,0.8)' }}>
                {n.label}
              </text>
            </g>
          );
        })}
      </svg>
    </div>
  );
}

// ═══ MAIN PAGE ═══
export default function ReferralMapPage() {
  const router = useRouter();
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [modal, setModal] = useState<'add' | 'edit' | 'import' | null>(null);
  const [form, setForm] = useState<Partial<Contact>>({});
  const [selectedChain, setSelectedChain] = useState<string | null>(null);
  const [search, setSearch] = useState('');
  const [impList, setImpList] = useState<{ fname: string; lname: string; firm: string; role: string; sel: boolean }[]>([]);
  const [showHelp, setShowHelp] = useState(false);
  const [graphExpanded, setGraphExpanded] = useState(false);
  useEffect(() => {
    if (typeof window === 'undefined') return;
    if (!localStorage.getItem('offerbell_user_id')) { router.replace('/signin'); return; }
    setContacts(load());
    const t = localStorage.getItem('offerbell-theme');
    if (t === 'dark') document.documentElement.setAttribute('data-theme', 'dark');
  }, [router]);

  useEffect(() => { if (contacts.length > 0) save(contacts); }, [contacts]);

  const getReferrals = (id: string): Contact[] => contacts.filter(c => c.referredBy === id);
  const getChainSize = (id: string): number => { const refs = getReferrals(id); return refs.length + refs.reduce((s, r) => s + getChainSize(r.id), 0); };

  const directContacts = contacts.filter(c => c.referredBy === 'you');
  const totalContacts = contacts.length;
  const totalChains = directContacts.filter(c => getReferrals(c.id).length > 0).length;

  const q = search.toLowerCase().trim();
  const matchesSearch = (c: Contact) => !q || c.name.toLowerCase().includes(q) || c.firm.toLowerCase().includes(q);

  // Selected chain detail
  const selectedContact = contacts.find(c => c.id === selectedChain);
  const selectedRefs = selectedChain ? getReferrals(selectedChain) : [];

  // Actions
  const openAdd = (referredBy?: string) => { setForm({ referredBy: referredBy || 'you' }); setModal('add'); };
  const openEdit = (c: Contact) => { setForm({ ...c }); setModal('edit'); };
  const openImport = () => {
    try {
      const tr = JSON.parse(localStorage.getItem(TK) || '[]') as { fname: string; lname: string; firm: string; role: string }[];
      const existing = new Set(contacts.map(c => c.name.toLowerCase()));
      setImpList(tr.filter(c => !existing.has(`${c.fname} ${c.lname}`.toLowerCase().trim())).map(c => ({ ...c, sel: false })));
    } catch { setImpList([]); }
    setModal('import');
  };
  const saveForm = () => {
    if (!form.name?.trim()) return;
    const id = form.id || `r_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`;
    const contact: Contact = { id, name: form.name!.trim(), firm: form.firm || '', role: form.role || '', referredBy: form.referredBy || 'you', note: form.note || '', state: form.state || undefined, chainLabel: form.chainLabel || undefined, addedAt: form.addedAt || Date.now() };
    setContacts(prev => { const idx = prev.findIndex(c => c.id === id); if (idx >= 0) { const next = [...prev]; next[idx] = contact; return next; } return [...prev, contact]; });
    setModal(null); setForm({});
  };
  const deleteContact = () => {
    if (!form.id) return;
    setContacts(prev => prev.filter(c => c.id !== form.id).map(c => c.referredBy === form.id ? { ...c, referredBy: 'you' } : c));
    if (selectedChain === form.id) setSelectedChain(null);
    setModal(null); setForm({});
  };
  const doImport = () => {
    const toAdd = impList.filter(c => c.sel).map(c => ({ id: `imp_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`, name: `${c.fname} ${c.lname}`.trim(), firm: c.firm || '', role: c.role || '', referredBy: 'you', note: '', addedAt: Date.now() }));
    setContacts(prev => [...prev, ...toAdd]); setModal(null);
  };

  // Recursive render for chain detail
  const renderNode = (c: Contact, depth: number = 0): React.ReactNode => {
    const refs = getReferrals(c.id);
    return (
      <div key={c.id}>
        <div className="rm-node" onClick={() => openEdit(c)}>
          <div className="rm-node-dot" style={{ background: getColor(c.name) }} />
          <div className="rm-node-info">
            <div className="rm-node-name">{c.name}</div>
            <div className="rm-node-detail">{c.firm}{c.role ? ` — ${c.role}` : ''}{c.state ? ` • ${c.state}` : ''}{c.note ? ` | ${c.note}` : ''}</div>
          </div>
          <span style={{ fontSize: 10, color: 'var(--text-3)' }}>Edit</span>
        </div>
        {refs.length > 0 && <div className="rm-chain-line" style={{ marginLeft: 12 }}>{refs.map(r => renderNode(r, depth + 1))}</div>}
      </div>
    );
  };

  return (
    <div className="app">
      <Sidebar activePage="referral-map" />
      <main className="main rm-main">
        <div className="rm-wrap">
          <div className="rm-header">
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <div className="rm-title">Referral <em>Map</em></div>
              <button onClick={() => setShowHelp(true)} style={{ width: 24, height: 24, borderRadius: '50%', border: '1.5px solid var(--border)', background: 'var(--surface)', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', flexShrink: 0, marginTop: 4 }} type="button" title="How to use">
                <svg width="12" height="12" fill="none" stroke="var(--text-3)" strokeWidth="2" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/><circle cx="12" cy="17" r="0.5" fill="var(--text-3)"/></svg>
              </button>
            </div>
            <div className="rm-sub">Visualize your network. Select a chain below the graph to explore referral connections.</div>
          </div>

          {/* Actions */}
          <div className="rm-actions">
            <button className="rm-btn-primary" onClick={() => openAdd()} type="button">
              <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><path d="M12 5v14M5 12h14"/></svg>Add Contact
            </button>
            <button className="rm-btn-secondary" onClick={openImport} type="button">
              <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>Import from Tracker
            </button>
            {totalContacts > 0 && (
              <div className="rm-search-wrap">
                <svg width="14" height="14" fill="none" stroke="var(--text-3)" strokeWidth="2" viewBox="0 0 24 24"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg>
                <input className="rm-search" placeholder="Search..." value={search} onChange={e => setSearch(e.target.value)} />
              </div>
            )}
          </div>

          {/* Stats & Search Results */}
          {search ? (
            <div className="rm-search-results" style={{ marginBottom: 24, animation: 'rm-slide-in 0.2s ease' }}>
              <div style={{ fontSize: 14, fontWeight: 700, color: 'var(--text)', marginBottom: 12, paddingLeft: 4 }}>Search Results for &quot;{search}&quot;</div>
              <div className="rm-direct" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 12 }}>
                {contacts.filter(matchesSearch).map(c => (
                  <div key={c.id} className="rm-direct-card" style={{ background: 'var(--surface-2)', border: '1.5px solid var(--border)', borderRadius: 12, padding: '14px 16px', display: 'flex', alignItems: 'center', gap: 12, cursor: 'pointer', transition: 'all 0.15s' }}
                    onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--text)'; e.currentTarget.style.transform = 'translateY(-2px)'; }}
                    onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.transform = 'translateY(0)'; }}
                    onClick={() => {
                    const findRoot = (contactId: string): string => {
                      const ct = contacts.find(x => x.id === contactId);
                      if (!ct || ct.referredBy === 'you') return contactId;
                      return findRoot(ct.referredBy);
                    };
                    setSelectedChain(findRoot(c.id));
                    setSearch(''); // clear search on selection to return to graph
                  }}>
                    <div className="rm-node-dot" style={{ width: 14, height: 14, borderRadius: '50%', background: getColor(c.name), flexShrink: 0, boxShadow: '0 2px 4px rgba(0,0,0,0.2)' }} />
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div className="rm-node-name" style={{ fontSize: 14, fontWeight: 700, color: 'var(--text)' }}>{c.name}</div>
                      <div className="rm-node-detail" style={{ fontSize: 12, color: 'var(--text-3)', marginTop: 2 }}>{c.firm}{c.role ? ` — ${c.role}` : ''}</div>
                    </div>
                    <svg width="16" height="16" fill="none" stroke="var(--text-3)" strokeWidth="2.5" viewBox="0 0 24 24"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
                  </div>
                ))}
                {contacts.filter(matchesSearch).length === 0 && (
                  <div style={{ padding: '24px', background: 'var(--surface)', borderRadius: 12, border: '1.5px dashed var(--border)', fontSize: 13, color: 'var(--text-3)', gridColumn: '1 / -1', textAlign: 'center' }}>No contacts match &quot;{search}&quot;. Try a different name or firm.</div>
                )}
              </div>
            </div>
          ) : (
            totalContacts > 0 && (
              <div className="rm-stats">
                <div className="rm-stat"><div className="rm-stat-val">{totalContacts}</div><div className="rm-stat-lbl">Contacts</div></div>
                <div className="rm-stat"><div className="rm-stat-val">{directContacts.length}</div><div className="rm-stat-lbl">Direct</div></div>
                <div className="rm-stat"><div className="rm-stat-val">{totalContacts - directContacts.length}</div><div className="rm-stat-lbl">Referred</div></div>
                <div className="rm-stat"><div className="rm-stat-val">{totalChains}</div><div className="rm-stat-lbl">Chains</div></div>
              </div>
            )
          )}

          {/* ═══ NETWORK GRAPH ═══ */}
          {totalContacts > 0 && (
            <div className="rm-graph-container">
              {/* Added 3D CSS Grid Layer representing depth */}
              <div className="rm-graph-grid">
                <div className="rm-graph-grid-inner" />
              </div>
              
              <button
                onClick={() => setGraphExpanded(true)}
                style={{ position: 'absolute', top: 12, right: 12, zIndex: 10, width: 32, height: 32, borderRadius: 8, border: '1.5px solid rgba(255,255,255,0.2)', background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', transition: 'all 0.15s' }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.8)'; e.currentTarget.style.background = 'rgba(0,0,0,0.8)'; }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.2)'; e.currentTarget.style.background = 'rgba(0,0,0,0.5)'; }}
                type="button"
                title="Expand map"
              >
                <svg width="14" height="14" fill="none" stroke="#fff" strokeWidth="2" viewBox="0 0 24 24"><polyline points="15 3 21 3 21 9"/><polyline points="9 21 3 21 3 15"/><line x1="21" y1="3" x2="14" y2="10"/><line x1="3" y1="21" x2="10" y2="14"/></svg>
              </button>
              
              <NetworkGraph contacts={contacts} selectedId={selectedChain} expanded={false} searchQuery={q} onSelect={(id) => {
                if (!id) { setSelectedChain(null); return; }
                const findRoot = (contactId: string): string => {
                  const c = contacts.find(x => x.id === contactId);
                  if (!c || c.referredBy === 'you') return contactId;
                  return findRoot(c.referredBy);
                };
                setSelectedChain(findRoot(id));
              }} />
            </div>
          )}

          {/* Empty state */}
          {totalContacts === 0 && (
            <div className="rm-empty">
              <div className="rm-empty-icon"><svg width="28" height="28" fill="none" stroke="var(--text-3)" strokeWidth="1.5" viewBox="0 0 24 24"><circle cx="5" cy="6" r="3"/><circle cx="19" cy="6" r="3"/><circle cx="12" cy="18" r="3"/><path d="M5 9v3a4 4 0 0 0 4 4h2"/><path d="M19 9v3a4 4 0 0 1-4 4h-2"/></svg></div>
              <div className="rm-empty-title">Start building your referral map</div>
              <div className="rm-empty-sub">Add contacts and track who referred you to whom. Your network graph will appear here as you add connections.</div>
              <button className="rm-btn-primary" onClick={() => openAdd()} type="button">
                <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><path d="M12 5v14M5 12h14"/></svg>Add Your First Contact
              </button>
            </div>
          )}

          {/* ═══ CHAIN VIEWER ═══ */}
          {totalContacts > 0 && (() => {
            // Build chain options: direct contacts that have referrals = chains, plus standalone directs
            const isContactMatch = (id: string): boolean => {
              const c = contacts.find(x => x.id === id);
              return c ? matchesSearch(c) : false;
            };
            const chainHasMatch = (rootId: string): boolean => {
               if (isContactMatch(rootId)) return true;
               const refs = getReferrals(rootId);
               return refs.some(r => chainHasMatch(r.id));
            };

            const chains = directContacts.filter(c => getReferrals(c.id).length > 0 && (!q || chainHasMatch(c.id)));
            const standalones = directContacts.filter(c => getReferrals(c.id).length === 0 && (!q || chainHasMatch(c.id)));

            return (
              <>
                {/* Chain selector dropdown */}
                <div className="rm-chain-viewer">
                  <div className="rm-chain-viewer-header">
                    <div>
                      <div style={{ fontSize: 14, fontWeight: 700, color: 'var(--text)' }}>Explore Chains</div>
                      <div style={{ fontSize: 11, color: 'var(--text-3)', marginTop: 2 }}>Select a chain to see who referred whom</div>
                    </div>
                    <select
                      className="rm-chain-select"
                      value={selectedChain || ''}
                      onChange={e => setSelectedChain(e.target.value || null)}
                    >
                      <option value="">Choose a chain...</option>
                      {chains.map(c => (
                        <option key={c.id} value={c.id}>
                          {c.chainLabel || `${c.name}'s Chain`} ({getChainSize(c.id)} referral{getChainSize(c.id) !== 1 ? 's' : ''})
                        </option>
                      ))}
                      {standalones.length > 0 && <option disabled>--- Direct Contacts ---</option>}
                      {standalones.map(c => (
                        <option key={c.id} value={c.id}>{c.name} (no referrals yet)</option>
                      ))}
                    </select>
                  </div>

                  {/* Selected chain content */}
                  {selectedContact && (
                    <div className="rm-chain-content">
                      {/* Chain title + actions */}
                      <div className="rm-chain-title-row">
                        <div className="rm-chain-avatar" style={{ background: getColor(selectedContact.name) }}>{getInitials(selectedContact.name)}</div>
                        <div style={{ flex: 1 }}>
                          <input
                            className="rm-chain-label-input"
                            value={selectedContact.chainLabel || `${selectedContact.name}'s Chain`}
                            onChange={e => {
                              const val = e.target.value;
                              setContacts(prev => prev.map(c => c.id === selectedContact.id ? { ...c, chainLabel: val } : c));
                            }}
                            onBlur={e => {
                              const val = e.target.value.trim();
                              if (!val || val === `${selectedContact.name}'s Chain`) {
                                setContacts(prev => prev.map(c => c.id === selectedContact.id ? { ...c, chainLabel: undefined } : c));
                              }
                            }}
                          />
                          <div style={{ fontSize: 11, color: 'var(--text-3)', marginTop: 2 }}>{selectedContact.firm}{selectedContact.role ? ` — ${selectedContact.role}` : ''} {selectedRefs.length > 0 ? `| ${getChainSize(selectedContact.id)} referral${getChainSize(selectedContact.id) !== 1 ? 's' : ''}` : ''}</div>
                        </div>
                        <div style={{ display: 'flex', gap: 6, flexShrink: 0 }}>
                          <button className="rm-btn-secondary" style={{ fontSize: 11, padding: '5px 12px' }} onClick={() => openEdit(selectedContact)} type="button">Edit</button>
                          <button className="rm-btn-secondary" style={{ fontSize: 11, padding: '5px 12px' }} onClick={() => openAdd(selectedContact.id)} type="button">
                            <svg width="10" height="10" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><path d="M12 5v14M5 12h14"/></svg>Add Referral
                          </button>
                        </div>
                      </div>

                      {/* Chain tree */}
                      {selectedRefs.length > 0 ? (
                        <div className="rm-chain-tree">
                          <div className="rm-chain-line">
                            {selectedRefs.map(r => renderNode(r))}
                          </div>
                        </div>
                      ) : (
                        <div style={{ padding: '24px 0', color: 'var(--text-3)', fontSize: 13, textAlign: 'center' }}>
                          No referrals from {selectedContact.name} yet. Add one to start building this chain.
                        </div>
                      )}
                    </div>
                  )}

                  {/* No chain selected state */}
                  {!selectedChain && chains.length > 0 && (
                    <div style={{ padding: '32px 20px', textAlign: 'center', color: 'var(--text-3)', fontSize: 13 }}>
                      Select a chain above to explore referral connections.
                    </div>
                  )}
                  {!selectedChain && chains.length === 0 && standalones.length > 0 && (
                    <div style={{ padding: '32px 20px', textAlign: 'center', color: 'var(--text-3)', fontSize: 13 }}>
                      No chains yet. When a contact refers you to someone else, a chain will appear here.
                    </div>
                  )}
                </div>
              </>
            );
          })()}
        </div>
      </main>

      {/* ═══ ADD/EDIT MODAL ═══ */}
      {(modal === 'add' || modal === 'edit') && (
        <div className="rm-modal-bg" onClick={() => setModal(null)}>
          <div className="rm-modal" onClick={e => e.stopPropagation()}>
            <div className="rm-modal-title">{modal === 'edit' ? 'Edit Contact' : 'Add Contact'}</div>
            <div className="rm-field"><label className="rm-label">Full Name</label><input className="rm-input" value={form.name || ''} onChange={e => setForm(p => ({ ...p, name: e.target.value }))} placeholder="e.g. Sarah Chen" autoFocus /></div>
            <div className="rm-input-row">
              <div className="rm-field" style={{ flex: 1 }}><label className="rm-label">Firm</label><input className="rm-input" value={form.firm || ''} onChange={e => setForm(p => ({ ...p, firm: e.target.value }))} placeholder="e.g. Goldman Sachs" /></div>
              <div className="rm-field" style={{ flex: 1 }}><label className="rm-label">Role</label><input className="rm-input" value={form.role || ''} onChange={e => setForm(p => ({ ...p, role: e.target.value }))} placeholder="e.g. VP, TMT" /></div>
            </div>
            <div className="rm-field">
              <label className="rm-label">Location (State)</label>
              <select className="rm-input" value={form.state || ''} onChange={e => setForm(p => ({ ...p, state: e.target.value }))} style={{ cursor: 'pointer' }}>
                <option value="">-- Unmapped / No location --</option>
                {Object.entries(US_STATES).map(([code, st]) => (<option key={code} value={code}>{st.name} ({code})</option>))}
              </select>
            </div>
            <div className="rm-field">
              <label className="rm-label">Who referred you to this person?</label>
              <select className="rm-input" value={form.referredBy || 'you'} onChange={e => setForm(p => ({ ...p, referredBy: e.target.value }))} style={{ cursor: 'pointer' }}>
                <option value="you">I reached out directly</option>
                {contacts.filter(c => c.id !== form.id).map(c => (<option key={c.id} value={c.id}>{c.name}{c.firm ? ` (${c.firm})` : ''}</option>))}
              </select>
            </div>
            <div className="rm-field"><label className="rm-label">Note (optional)</label><input className="rm-input" value={form.note || ''} onChange={e => setForm(p => ({ ...p, note: e.target.value }))} placeholder="e.g. Met at networking event" /></div>
            {modal === 'edit' && form.referredBy === 'you' && getReferrals(form.id || '').length > 0 && (
              <div className="rm-field"><label className="rm-label">Chain Label</label><input className="rm-input" value={form.chainLabel || ''} onChange={e => setForm(p => ({ ...p, chainLabel: e.target.value }))} placeholder={`e.g. Goldman TMT Chain`} /></div>
            )}
            <div className="rm-modal-actions">
              <button className="rm-btn-primary" style={{ flex: 1 }} onClick={saveForm} type="button">{modal === 'edit' ? 'Save Changes' : 'Add Contact'}</button>
              {modal === 'edit' && <button onClick={deleteContact} style={{ padding: '10px 14px', borderRadius: 8, border: '1.5px solid #ef4444', background: 'none', color: '#ef4444', fontSize: 13, fontWeight: 600, cursor: 'pointer' }} type="button">Remove</button>}
              <button className="rm-btn-secondary" onClick={() => setModal(null)} type="button">Cancel</button>
            </div>
          </div>
        </div>
      )}

      {/* ═══ IMPORT MODAL ═══ */}
      {modal === 'import' && (
        <div className="rm-modal-bg" onClick={() => setModal(null)}>
          <div className="rm-modal" onClick={e => e.stopPropagation()} style={{ maxHeight: '70vh', display: 'flex', flexDirection: 'column' }}>
            <div className="rm-modal-title">Import from Outreach Tracker</div>
            <div style={{ fontSize: 12, color: 'var(--text-3)', marginBottom: 14 }}>Select contacts to add to your referral map.</div>
            {impList.length === 0 ? (
              <div style={{ padding: '32px 0', textAlign: 'center', color: 'var(--text-3)', fontSize: 13 }}>All tracker contacts are already on your map.</div>
            ) : (
              <div style={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: 4, marginBottom: 14 }}>
                <button onClick={() => setImpList(l => l.map(c => ({ ...c, sel: !l.every(x => x.sel) })))} style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-2)', background: 'none', border: 'none', cursor: 'pointer', textAlign: 'left', padding: '4px 0' }} type="button">{impList.every(c => c.sel) ? 'Deselect all' : 'Select all'}</button>
                {impList.map((c, i) => (
                  <div key={i} onClick={() => setImpList(l => l.map((x, j) => j === i ? { ...x, sel: !x.sel } : x))} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '8px 10px', borderRadius: 8, border: `1.5px solid ${c.sel ? 'var(--text)' : 'var(--border)'}`, background: c.sel ? 'var(--surface-2)' : 'transparent', cursor: 'pointer' }}>
                    <div style={{ width: 18, height: 18, borderRadius: 4, border: `2px solid ${c.sel ? 'var(--text)' : 'var(--border)'}`, background: c.sel ? 'var(--text)' : 'transparent', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>{c.sel && <svg width="12" height="12" fill="none" stroke="var(--surface)" strokeWidth="3" viewBox="0 0 24 24"><polyline points="20 6 9 17 4 12"/></svg>}</div>
                    <div><div style={{ fontSize: 13, fontWeight: 600, color: 'var(--text)' }}>{c.fname} {c.lname}</div><div style={{ fontSize: 11, color: 'var(--text-3)' }}>{c.firm}{c.role ? ` — ${c.role}` : ''}</div></div>
                  </div>
                ))}
              </div>
            )}
            <div className="rm-modal-actions">
              {impList.filter(c => c.sel).length > 0 && <button className="rm-btn-primary" style={{ flex: 1 }} onClick={doImport} type="button">Import {impList.filter(c => c.sel).length}</button>}
              <button className="rm-btn-secondary" onClick={() => setModal(null)} type="button">Cancel</button>
            </div>
          </div>
        </div>
      )}

      {/* ═══ FULLSCREEN GRAPH ═══ */}
      {graphExpanded && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 300, background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(8px)', display: 'flex', flexDirection: 'column' }} onClick={() => setGraphExpanded(false)}>
          <div style={{ position: 'absolute', top: 20, right: 20, display: 'flex', gap: 8, zIndex: 310 }}>
            <div style={{ background: 'var(--surface)', borderRadius: 10, padding: '8px 16px', fontSize: 12, fontWeight: 600, color: 'var(--text-3)', border: '1px solid var(--border)' }}>
              Click a node to select chain &middot; Click outside to close
            </div>
            <button
              onClick={(e) => { e.stopPropagation(); setGraphExpanded(false); }}
              style={{ width: 36, height: 36, borderRadius: 10, border: '1.5px solid var(--border)', background: 'var(--surface)', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}
              type="button"
            >
              <svg width="16" height="16" fill="none" stroke="var(--text)" strokeWidth="2" viewBox="0 0 24 24"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
            </button>
          </div>
          <div onClick={e => e.stopPropagation()} style={{ flex: 1, margin: 20, borderRadius: 20, background: 'var(--surface)', border: '1.5px solid var(--border)', overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
            <div style={{ padding: '16px 24px', borderBottom: '1px solid var(--border)', display: 'flex', alignItems: 'center', gap: 12 }}>
              <svg width="18" height="18" fill="none" stroke="var(--text)" strokeWidth="1.5" viewBox="0 0 24 24"><circle cx="5" cy="6" r="3"/><circle cx="19" cy="6" r="3"/><circle cx="12" cy="18" r="3"/><path d="M5 9v3a4 4 0 0 0 4 4h2"/><path d="M19 9v3a4 4 0 0 1-4 4h-2"/></svg>
              <div style={{ fontFamily: "'Instrument Serif', serif", fontSize: 20, color: 'var(--text)' }}>Referral <em style={{ fontStyle: 'italic' }}>Map</em></div>
              <div style={{ fontSize: 12, color: 'var(--text-3)', marginLeft: 8 }}>{totalContacts} contacts &middot; {totalChains} chains</div>
            </div>
            <div style={{ flex: 1, position: 'relative', overflow: 'hidden' }}>
              {/* Fullscreen Graph Grid */}
              <div className="rm-graph-container" style={{ position: 'absolute', inset: 0, borderRadius: 0, border: 'none', margin: 0, boxShadow: 'none' }}>
                <div className="rm-graph-grid">
                  <div className="rm-graph-grid-inner" />
                </div>
                <NetworkGraph contacts={contacts} selectedId={selectedChain} expanded={true} searchQuery={q} onSelect={(id) => {
                  if (!id) { setSelectedChain(null); return; }
                  const findRoot = (contactId: string): string => {
                    const c = contacts.find(x => x.id === contactId);
                    if (!c || c.referredBy === 'you') return contactId;
                    return findRoot(c.referredBy);
                  };
                  setSelectedChain(findRoot(id));
                  setGraphExpanded(false);
                }} />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ═══ HELP MODAL ═══ */}
      {showHelp && (
        <div className="rm-modal-bg" onClick={() => setShowHelp(false)}>
          <div className="rm-modal" onClick={e => e.stopPropagation()} style={{ maxWidth: 480 }}>
            <div className="rm-modal-title">How to Use Referral Map</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16, fontSize: 13, color: 'var(--text-2)', lineHeight: 1.7 }}>
              <div>
                <div style={{ fontWeight: 700, color: 'var(--text)', marginBottom: 4 }}>1. Add contacts</div>
                Click "Add Contact" to add someone you've networked with. Choose whether you reached out directly or were referred by someone already on your map.
              </div>
              <div>
                <div style={{ fontWeight: 700, color: 'var(--text)', marginBottom: 4 }}>2. Build referral chains</div>
                When someone refers you to another person, add them and select the referrer in the "Who referred you?" dropdown. This creates a chain you can trace visually.
              </div>
              <div>
                <div style={{ fontWeight: 700, color: 'var(--text)', marginBottom: 4 }}>3. Name your chains</div>
                Click on a chain title (e.g. "Sarah's Chain") to rename it to something meaningful like "Goldman TMT Chain" or "Evercore Connections". This label shows on the graph too.
              </div>
              <div>
                <div style={{ fontWeight: 700, color: 'var(--text)', marginBottom: 4 }}>4. Explore the graph</div>
                The network map at the top shows your connections visually. You're in the center, direct contacts in the first ring, and their referrals in outer rings. Click any node to jump to that chain.
              </div>
              <div>
                <div style={{ fontWeight: 700, color: 'var(--text)', marginBottom: 4 }}>5. Import from Tracker</div>
                Already have contacts in your Outreach Tracker? Click "Import from Tracker" to pull them in without re-entering everything.
              </div>
            </div>
            <div className="rm-modal-actions" style={{ marginTop: 20 }}>
              <button className="rm-btn-primary" style={{ flex: 1 }} onClick={() => setShowHelp(false)} type="button">Got it</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
