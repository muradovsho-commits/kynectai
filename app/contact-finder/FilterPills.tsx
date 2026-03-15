'use client';
import { useState, useRef, useEffect } from 'react';

const FIRMS = [
  "Goldman Sachs","J.P. Morgan","Morgan Stanley","Evercore","Lazard","Centerview Partners","PJT Partners","Moelis","Guggenheim Partners","Houlihan Lokey",
  "William Blair","Raymond James","Jefferies","RBC Capital Markets","Barclays","Citi","Bank of America","UBS","Deutsche Bank","Wells Fargo",
  "Macquarie","Nomura","Cowen","Stifel","Piper Sandler","Canaccord Genuity","Lincoln International","Harris Williams","Robert W. Baird","Stephens Inc.",
  "Blackstone","KKR","Apollo Global Management","Carlyle","Ares Management","TPG","Thoma Bravo","Vista Equity","Advent International","Hellman & Friedman",
  "Silver Lake","General Atlantic","Warburg Pincus","EQT","CVC Capital","Cinven","Permira","Clayton Dubilier & Rice","Insight Partners","Tiger Global",
  "Two Sigma","D.E. Shaw","Citadel","Citadel Securities","Jane Street","Hudson River Trading","Virtu Financial","Renaissance Technologies","Jump Trading","Point72",
  "Millennium Management","AQR Capital","Bridgewater Associates","Man Group","Winton Group",
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
  "Consulting","Corporate Finance / FP&A","Corporate Development","Real Estate","Credit / Debt",
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

function Dropdown({ items, selected, onToggle, placeholder }: {
  items: string[];
  selected: string[];
  onToggle: (val: string) => void;
  placeholder: string;
}) {
  const [q, setQ] = useState('');
  const filtered = q.trim() ? items.filter(i => i.toLowerCase().includes(q.toLowerCase())) : [];

  return (
    <div style={{ padding: '8px' }} onClick={e => e.stopPropagation()}>
      <input
        autoFocus
        type="text"
        value={q}
        onChange={e => setQ(e.target.value)}
        placeholder={placeholder}
        style={{
          width: '100%', padding: '8px 12px', border: '1.5px solid #e4e2de',
          borderRadius: '8px', fontSize: '13px', outline: 'none',
          fontFamily: 'Sora, sans-serif', marginBottom: '6px',
          background: 'var(--surface, #fff)', color: 'var(--text, #0c0c0c)'
        }}
      />
      <div style={{ maxHeight: '260px', overflowY: 'auto' }}>
        {!q.trim() && (
          <div style={{ padding: '8px 12px', fontSize: '12px', color: '#9b9997' }}>
            Type to search…
          </div>
        )}
        {q.trim() && filtered.length === 0 && (
          <div style={{ padding: '8px 12px', fontSize: '12px', color: '#9b9997' }}>
            No results found
          </div>
        )}
        {filtered.slice(0, 15).map(item => (
          <label
            key={item}
            style={{
              display: 'flex', alignItems: 'center', gap: '10px',
              padding: '8px 12px', cursor: 'pointer', borderRadius: '6px',
              fontSize: '13px', color: 'var(--text, #0c0c0c)',
              background: selected.includes(item) ? 'var(--surface-2, #f5f4f2)' : 'transparent',
              fontWeight: selected.includes(item) ? '600' : '400',
            }}
            onMouseEnter={e => { if (!selected.includes(item)) (e.currentTarget as HTMLElement).style.background = 'var(--surface-2, #f5f4f2)'; }}
            onMouseLeave={e => { if (!selected.includes(item)) (e.currentTarget as HTMLElement).style.background = 'transparent'; }}
          >
            <input
              type="checkbox"
              checked={selected.includes(item)}
              onChange={() => onToggle(item)}
              style={{ accentColor: '#0c0c0c', cursor: 'pointer', width: '14px', height: '14px', flexShrink: 0 }}
            />
            {item}
          </label>
        ))}
      </div>
      {selected.length > 0 && (
        <button
          onClick={() => selected.forEach(v => onToggle(v))}
          style={{
            display: 'block', width: '100%', marginTop: '6px', padding: '6px',
            fontSize: '12px', color: '#9b9997', background: 'none',
            border: 'none', borderTop: '1px solid #e4e2de', cursor: 'pointer',
            fontFamily: 'Sora, sans-serif'
          }}
        >
          Clear all
        </button>
      )}
    </div>
  );
}

const PILLS: { key: FilterKey; label: string; items: string[]; placeholder: string; icon: string }[] = [
  { key: 'firm', label: 'Firm', items: FIRMS, placeholder: 'Search firms…', icon: '🏢' },
  { key: 'role', label: 'Role', items: ROLES, placeholder: 'Search roles…', icon: '👤' },
  { key: 'location', label: 'Location', items: LOCATIONS, placeholder: 'Search locations…', icon: '📍' },
  { key: 'vertical', label: 'Vertical', items: VERTICALS, placeholder: 'Search verticals…', icon: '📊' },
  { key: 'school', label: 'School', items: SCHOOLS, placeholder: 'Search schools…', icon: '🎓' },
];

export default function FilterPills({ filters, onChange }: Props) {
  const [open, setOpen] = useState<FilterKey | null>(null);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(null);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const toggle = (key: FilterKey, val: string) => {
    const cur = filters[key];
    const next = cur.includes(val) ? cur.filter(x => x !== val) : [...cur, val];
    onChange({ ...filters, [key]: next });
  };

  const pillLabel = (key: FilterKey, label: string) => {
    const arr = filters[key];
    if (arr.length === 0) return label;
    if (arr.length === 1) return arr[0].length > 18 ? arr[0].slice(0, 18) + '…' : arr[0];
    return `${label} (${arr.length})`;
  };

  const hasAny = Object.values(filters).some(a => a.length > 0);

  return (
    <div ref={ref} style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap', marginTop: '14px' }}>
      <span style={{ fontSize: '11px', fontWeight: 700, color: '#9b9997', textTransform: 'uppercase', letterSpacing: '1px' }}>
        Filter:
      </span>

      {PILLS.map(pill => (
        <div key={pill.key} style={{ position: 'relative' }}>
          <button
            type="button"
            onClick={() => setOpen(open === pill.key ? null : pill.key)}
            style={{
              display: 'flex', alignItems: 'center', gap: '6px',
              padding: '6px 14px', borderRadius: '100px',
              border: filters[pill.key].length > 0 ? '1.5px solid #0c0c0c' : '1.5px solid #dddcda',
              background: filters[pill.key].length > 0 ? '#0c0c0c' : 'var(--surface, #fff)',
              color: filters[pill.key].length > 0 ? '#fff' : 'var(--text-2, #636160)',
              fontSize: '12px', fontWeight: 500, cursor: 'pointer',
              fontFamily: 'Sora, sans-serif', whiteSpace: 'nowrap',
            }}
          >
            {pillLabel(pill.key, pill.label)}
            <svg width="10" height="10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <polyline points="6 9 12 15 18 9" />
            </svg>
          </button>

          {open === pill.key && (
            <div style={{
              position: 'absolute', top: 'calc(100% + 6px)', left: 0,
              background: 'var(--surface, #fff)', border: '1.5px solid #e4e2de',
              borderRadius: '12px', zIndex: 9999, minWidth: '240px',
              boxShadow: '0 8px 32px rgba(0,0,0,0.12)',
            }}>
              <Dropdown
                items={pill.items}
                selected={filters[pill.key]}
                onToggle={val => toggle(pill.key, val)}
                placeholder={pill.placeholder}
              />
            </div>
          )}
        </div>
      ))}

      {hasAny && (
        <button
          type="button"
          onClick={() => onChange({ firm: [], role: [], location: [], vertical: [], school: [] })}
          style={{
            padding: '6px 14px', borderRadius: '100px', border: '1.5px solid #fecaca',
            background: 'none', color: '#dc2626', fontSize: '12px', fontWeight: 600,
            cursor: 'pointer', fontFamily: 'Sora, sans-serif'
          }}
        >
          × Clear all
        </button>
      )}

      <p style={{ width: '100%', marginTop: '4px', fontSize: '11px', color: '#9b9997' }}>
        Tip: select multiple filters to narrow your search
      </p>
    </div>
  );
}
