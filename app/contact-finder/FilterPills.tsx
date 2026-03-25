'use client';
import { useState, useRef, useEffect, useCallback } from 'react';

const FIRMS = [
  "Goldman Sachs","J.P. Morgan","Morgan Stanley","Evercore","Lazard","Centerview Partners","PJT Partners","Moelis","Guggenheim Partners","Houlihan Lokey",
  "William Blair","Raymond James","Jefferies","RBC Capital Markets","Barclays","Citi","Bank of America","UBS","Deutsche Bank","Wells Fargo",
  "Macquarie","Nomura","Cowen","Stifel","Piper Sandler","Canaccord Genuity","Lincoln International","Harris Williams","Robert W. Baird","Stephens Inc.",
  "KeyBanc Capital Markets","BGL","BMO Capital Markets","HSBC","BNP Paribas","Societe Generale","Credit Agricole","Mizuho","CIBC","TD Securities","Scotiabank",
  "Perella Weinberg Partners","Qatalyst Partners","Allen & Company","LionTree","Ducera Partners","Greenhill","Truist Securities","Loop Capital Markets",
  "Blackstone","KKR","Apollo Global Management","Carlyle","Ares Management","TPG","Thoma Bravo","Vista Equity","Advent International","Hellman & Friedman",
  "Silver Lake","General Atlantic","Warburg Pincus","EQT","CVC Capital","Cinven","Permira","Clayton Dubilier & Rice","Insight Partners","Tiger Global",
  "Bain Capital","Brookfield Asset Management","Cerberus Capital","Leonard Green & Partners","American Securities","GTCR","Madison Dearborn Partners","Welsh Carson",
  "Francisco Partners","Summit Partners","TA Associates","Audax Group","Genstar Capital","Platinum Equity","Roark Capital","Kohlberg & Company",
  "Two Sigma","D.E. Shaw","Citadel","Citadel Securities","Jane Street","Hudson River Trading","Virtu Financial","Renaissance Technologies","Jump Trading","Point72",
  "Millennium Management","AQR Capital","Bridgewater Associates","Man Group","Winton Group",
  "Coatue Management","Viking Global Investors","Lone Pine Capital","Pershing Square","Elliott Management","Third Point","ValueAct Capital","Baupost Group",
  "Sequoia Capital","Andreessen Horowitz","Bessemer Venture Partners","Lightspeed Venture Partners","Accel","Greylock Partners","Benchmark","NEA","Index Ventures",
  "McKinsey & Company","Boston Consulting Group","Bain & Company","Deloitte","EY","PwC","KPMG","LEK","Oliver Wyman","Strategy&","Accenture","Alvarez & Marsal",
];

const ROLES = [
  "Investment Banking Analyst","Investment Banking Associate","Vice President (IB)","Director (IB)","Managing Director (IB)",
  "Private Equity Analyst","Private Equity Associate","Vice President (PE)","Principal (PE)","Partner (PE)","Managing Partner",
  "Analyst (HF)","Associate (HF)","Portfolio Manager","Senior Portfolio Manager","Research Analyst","Macro Analyst","Risk Analyst",
  "Quantitative Analyst","Quantitative Researcher","Quantitative Trader","Quantitative Developer","Algorithmic Trader","Systematic Trader",
  "Venture Capital Analyst","Venture Capital Associate","Vice President (VC)","Principal (VC)","Partner (VC)","General Partner",
  "Sales Analyst","Sales Associate","Trader","Junior Trader","Senior Trader","Structurer","Derivatives Analyst",
  "Equity Research Analyst","Equity Research Associate","Senior Analyst (ER)","Director of Research",
  "Asset Management Analyst","Asset Management Associate","Portfolio Analyst","Investment Analyst","Fund Analyst",
  "Business Analyst","Consultant","Senior Consultant","Engagement Manager","Principal (Consulting)","Partner (Consulting)",
  "Financial Analyst","Senior Financial Analyst","Finance Manager","CFO","VP of Finance","FP&A Analyst","FP&A Manager",
  "Corporate Development Analyst","Corporate Development Associate","Director of Corporate Development",
  "Real Estate Analyst","Real Estate Associate","Acquisitions Analyst","Asset Manager (RE)",
  "Credit Analyst","Restructuring Analyst","Distressed Debt Analyst",
  "Summer Analyst","Summer Associate","Full-Time Analyst","Full-Time Associate","Investor Relations Analyst",
];

const VERTICALS = [
  "Investment Banking","Private Equity","Hedge Fund","Quantitative Research / Quant Trading",
  "Venture Capital","Growth Equity","Sales & Trading","Equity Research","Asset Management",
  "Consulting","Accounting / Audit / Tax","Corporate Finance / FP&A","Corporate Development","Real Estate","Credit / Debt",
  "Restructuring","Family Office","Endowment / Pension",
];

const LOCATIONS = [
  "New York, NY","San Francisco, CA","Chicago, IL","Boston, MA","Los Angeles, CA","Houston, TX",
  "Dallas, TX","Washington, DC","Atlanta, GA","Miami, FL","Seattle, WA","Minneapolis, MN",
  "Denver, CO","Philadelphia, PA","Charlotte, NC","Austin, TX","Nashville, TN","Baltimore, MD",
  "Greenwich, CT","Stamford, CT","Menlo Park, CA","Palo Alto, CA",
  "London, UK","Hong Kong","Singapore","Tokyo, Japan","Dubai, UAE","Toronto, Canada",
  "Sydney, Australia","Frankfurt, Germany","Paris, France","Zurich, Switzerland",
];

const SCHOOLS = [
  "Harvard University","Yale University","Princeton University","Columbia University","University of Pennsylvania",
  "Cornell University","Dartmouth College","Brown University","Massachusetts Institute of Technology","Stanford University",
  "University of Chicago","Duke University","Northwestern University","Georgetown University","Vanderbilt University",
  "Rice University","Washington University in St. Louis","University of Notre Dame","Emory University",
  "University of Southern California","New York University","Boston College","Boston University","Tufts University",
  "Wake Forest University","Lehigh University","Villanova University","Carnegie Mellon University",
  "Johns Hopkins University","George Washington University","American University","Syracuse University",
  "University of Rochester","Tulane University","Southern Methodist University","University of Miami",
  "Case Western Reserve University","Fordham University","Baruch College","Babson College","Bentley University",
  "Northeastern University","Bryant University","Quinnipiac University","Fairfield University",
  "University of Michigan","University of Virginia","University of North Carolina at Chapel Hill",
  "University of California Berkeley","UCLA","University of Texas at Austin","Georgia Institute of Technology",
  "University of Florida","University of Illinois Urbana-Champaign","University of Wisconsin Madison",
  "Penn State University","Ohio State University","Purdue University","Indiana University",
  "University of Minnesota","University of Maryland","Virginia Tech","University of Georgia",
  "Texas A&M University","University of Washington","University of Pittsburgh","Rutgers University",
  "University of Connecticut","University of Massachusetts Amherst","University of Colorado Boulder",
  "Arizona State University","University of Arizona","University of Tennessee","University of Alabama",
  "Auburn University","Louisiana State University","Florida State University","University of Central Florida",
  "Florida International University","University of South Florida","Miami University of Ohio",
  "Ohio University","University of Cincinnati","University of Iowa","Iowa State University",
  "University of Missouri","University of Kansas","University of Nebraska","University of Oklahoma",
  "Oklahoma State University","University of Utah","Brigham Young University","University of Oregon",
  "Oregon State University","University of Houston","Texas Christian University","Baylor University",
  "Texas Tech University","University of North Texas","University of South Carolina","Clemson University",
  "NC State University","William & Mary","Virginia Commonwealth University","George Mason University",
  "University of Richmond","Drexel University","Temple University","Bucknell University",
  "Lafayette College","Colgate University","Hamilton College","Union College",
  "Rensselaer Polytechnic Institute","Rochester Institute of Technology","Stony Brook University",
  "University at Buffalo","Binghamton University","Hofstra University","West Virginia University",
  "University of Louisville","University of Memphis","DePaul University","Loyola University Chicago",
  "Marquette University","Creighton University","University of Tulsa","Elon University",
  "High Point University","Appalachian State University","UNC Charlotte","East Carolina University",
];

type FilterKey = 'firm' | 'role' | 'location' | 'vertical' | 'school';
type Filters = Record<FilterKey, string[]>;

interface Props {
  filters: Filters;
  onChange: (filters: Filters) => void;
}

const PILLS: { key: FilterKey; label: string; items: string[]; placeholder: string }[] = [
  { key: 'firm', label: 'Firm', items: FIRMS, placeholder: 'Search firms...' },
  { key: 'role', label: 'Role', items: ROLES, placeholder: 'Search roles...' },
  { key: 'location', label: 'Location', items: LOCATIONS, placeholder: 'Search locations...' },
  { key: 'vertical', label: 'Vertical', items: VERTICALS, placeholder: 'Search verticals...' },
  { key: 'school', label: 'School', items: SCHOOLS, placeholder: 'Search schools...' },
];

function DropdownMenu({ pill, selected, onToggle, onClear }: {
  pill: typeof PILLS[0]; selected: string[]; onToggle: (v: string) => void; onClear: () => void;
}) {
  const [q, setQ] = useState('');
  const listRef = useRef<HTMLDivElement>(null);
  const filtered = q.trim()
    ? pill.items.filter(i => i.toLowerCase().includes(q.toLowerCase()))
    : pill.items;

  return (
    <div
      style={{
        position: 'absolute', top: 'calc(100% + 6px)', left: 0,
        background: 'var(--surface)', border: '1.5px solid var(--border)',
        borderRadius: 12, zIndex: 9999, width: 280,
        boxShadow: '0 12px 40px rgba(0,0,0,0.25)',
      }}
    >
      <div style={{ padding: '10px 10px 6px' }}>
        <input
          autoFocus
          type="text"
          value={q}
          onChange={e => setQ(e.target.value)}
          placeholder={pill.placeholder}
          style={{
            width: '100%', padding: '9px 12px', border: '1.5px solid var(--border-2)',
            borderRadius: 8, fontSize: 13, outline: 'none',
            fontFamily: 'Sora, sans-serif',
            background: 'var(--bg)', color: 'var(--text)',
          }}
        />
      </div>
      <div
        ref={listRef}
        style={{
          maxHeight: 260, overflowY: 'scroll', padding: '0 6px 6px',
          WebkitOverflowScrolling: 'touch',
        }}
      >
        {filtered.length === 0 && (
          <div style={{ padding: 12, fontSize: 12, color: 'var(--text-3)', textAlign: 'center' }}>
            No results found
          </div>
        )}
        {filtered.map(item => {
          const on = selected.includes(item);
          return (
            <div
              key={item}
              role="button"
              tabIndex={0}
              onClick={() => onToggle(item)}
              style={{
                display: 'flex', alignItems: 'center', gap: 10,
                padding: '7px 8px', cursor: 'pointer', borderRadius: 6,
                fontSize: 13, color: 'var(--text)',
                background: on ? 'var(--surface-2)' : 'transparent',
                fontWeight: on ? 600 : 400,
                userSelect: 'none',
              }}
              onMouseEnter={e => { if (!on) e.currentTarget.style.background = 'var(--surface-2)'; }}
              onMouseLeave={e => { if (!on) e.currentTarget.style.background = 'transparent'; }}
            >
              <div style={{
                width: 15, height: 15, borderRadius: 3, flexShrink: 0,
                border: on ? '1.5px solid var(--text)' : '1.5px solid var(--border-2)',
                background: on ? 'var(--text)' : 'transparent',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: 9, color: 'var(--surface)', fontWeight: 700,
              }}>
                {on && '\u2713'}
              </div>
              {item}
            </div>
          );
        })}
      </div>
      {selected.length > 0 && (
        <div style={{ borderTop: '1px solid var(--border)', padding: '6px 8px' }}>
          <button
            onClick={onClear}
            type="button"
            style={{
              display: 'block', width: '100%', padding: 6,
              fontSize: 12, color: 'var(--text-3)', background: 'none',
              border: 'none', cursor: 'pointer', fontFamily: 'Sora, sans-serif',
              textAlign: 'center',
            }}
          >
            Clear all ({selected.length})
          </button>
        </div>
      )}
    </div>
  );
}

export default function FilterPills({ filters, onChange }: Props) {
  const [open, setOpen] = useState<FilterKey | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside the entire filter bar
  useEffect(() => {
    if (!open) return;
    const handler = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(null);
      }
    };
    // Use setTimeout so the current click event finishes before we attach
    const timer = setTimeout(() => document.addEventListener('click', handler), 0);
    return () => { clearTimeout(timer); document.removeEventListener('click', handler); };
  }, [open]);

  const toggle = useCallback((key: FilterKey, val: string) => {
    const cur = filters[key];
    const next = cur.includes(val) ? cur.filter(x => x !== val) : [...cur, val];
    onChange({ ...filters, [key]: next });
  }, [filters, onChange]);

  const pillLabel = (key: FilterKey, label: string) => {
    const arr = filters[key];
    if (arr.length === 0) return label;
    if (arr.length === 1) return arr[0].length > 18 ? arr[0].slice(0, 18) + '...' : arr[0];
    return `${label} (${arr.length})`;
  };

  const hasAny = Object.values(filters).some(a => a.length > 0);

  return (
    <div ref={containerRef} style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap', marginTop: 14 }}>
      <span style={{ fontSize: 11, fontWeight: 700, color: 'var(--text-3)', textTransform: 'uppercase', letterSpacing: 1 }}>
        Filter:
      </span>

      {PILLS.map(pill => (
        <div key={pill.key} style={{ position: 'relative' }}>
          <button
            type="button"
            onClick={() => setOpen(open === pill.key ? null : pill.key)}
            style={{
              display: 'flex', alignItems: 'center', gap: 6,
              padding: '6px 14px', borderRadius: 100,
              border: filters[pill.key].length > 0 ? '1.5px solid var(--text)' : '1.5px solid var(--border-2)',
              background: filters[pill.key].length > 0 ? 'var(--text)' : 'var(--surface)',
              color: filters[pill.key].length > 0 ? 'var(--surface)' : 'var(--text-2)',
              fontSize: 12, fontWeight: 500, cursor: 'pointer',
              fontFamily: 'Sora, sans-serif', whiteSpace: 'nowrap',
            }}
          >
            {pillLabel(pill.key, pill.label)}
            <svg width="10" height="10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <polyline points="6 9 12 15 18 9" />
            </svg>
          </button>

          {open === pill.key && (
            <DropdownMenu
              pill={pill}
              selected={filters[pill.key]}
              onToggle={val => toggle(pill.key, val)}
              onClear={() => onChange({ ...filters, [pill.key]: [] })}
            />
          )}
        </div>
      ))}

      {hasAny && (
        <button
          type="button"
          onClick={() => onChange({ firm: [], role: [], location: [], vertical: [], school: [] })}
          style={{
            padding: '6px 14px', borderRadius: 100, border: '1.5px solid #fecaca',
            background: 'none', color: '#dc2626', fontSize: 12, fontWeight: 600,
            cursor: 'pointer', fontFamily: 'Sora, sans-serif',
          }}
        >
          Clear all
        </button>
      )}

      <p style={{ width: '100%', marginTop: 4, fontSize: 11, color: 'var(--text-3)' }}>
        Tip: select multiple filters to narrow your search
      </p>
    </div>
  );
}
