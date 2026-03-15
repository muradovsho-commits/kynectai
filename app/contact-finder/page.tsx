"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import "./contact-finder.css";

const AVATAR_COLORS = ["#6366f1", "#0ea5e9", "#10b981", "#f59e0b", "#ec4899", "#8b5cf6", "#ef4444", "#14b8a6", "#f97316", "#6366f1"];

type ApiContact = {
  id: string;
  name: string;
  title: string;
  company: string;
  linkedinUrl: string | null;
  email: string | null;
  location: string;
};

type DisplayContact = {
  id: string;
  name: string;
  role: string;
  firm: string;
  group: string;
  school: string;
  year: string;
  location: string;
  email: string;
  linkedin: string;
  color: string;
  initials: string;
  verified: boolean;
};

function getInitials(name: string): string {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((p) => p[0]?.toUpperCase() ?? "")
    .join("") || "?";
}

function displayContactFromApi(c: ApiContact, index: number): DisplayContact {
  const color = AVATAR_COLORS[index % AVATAR_COLORS.length];
  const verified = !!(c.email && c.email.trim() !== "");
  return {
    id: c.id,
    name: c.name,
    role: c.title || "—",
    firm: c.company || "—",
    group: c.title || "—",
    school: "—",
    year: "—",
    location: c.location || "—",
    email: c.email ?? "",
    linkedin: c.linkedinUrl ?? "",
    color,
    initials: getInitials(c.name),
    verified,
  };
}

const GROUP_VERTICALS: Record<string, { label: string; verts: string[] }> = {
  ib: { label: "Investment Banking", verts: ["M&A Advisory", "Leveraged Finance", "ECM — Equity Capital Markets", "DCM — Debt Capital Markets", "Restructuring", "TMT Coverage", "Healthcare Coverage", "Consumer & Retail", "Industrials", "Real Estate", "Energy & Infrastructure", "FIG — Financial Institutions", "General Coverage"] },
  pe: { label: "Private Equity", verts: ["Buyout", "Growth Equity", "Venture / Early Stage", "Real Estate PE", "Infrastructure PE", "Credit / Direct Lending", "Secondaries", "Fund of Funds"] },
  hf: { label: "Hedge Fund", verts: ["Long / Short Equity", "Global Macro", "Quantitative / Systematic", "Multi-Strategy", "Credit", "Event Driven", "Distressed", "Convertible Arbitrage", "Commodities"] },
  st: { label: "Sales & Trading", verts: ["Equities Sales", "Equities Trading", "Fixed Income Sales", "Fixed Income Trading", "FX & Rates", "Commodities", "Structured Products", "Prime Brokerage", "Derivatives"] },
  er: { label: "Equity Research", verts: ["TMT", "Healthcare", "Consumer", "Financials", "Industrials", "Energy", "Real Estate", "Macro / Strategy", "Quant Research"] },
  vc: { label: "Venture Capital", verts: ["Pre-Seed / Seed", "Series A / Early Stage", "Growth / Late Stage", "Deep Tech", "Fintech", "Consumer", "Enterprise SaaS", "Healthcare / BioTech", "Climate Tech", "Crypto / Web3"] },
  con: { label: "Consulting", verts: ["Strategy", "Operations", "Technology", "Financial Advisory", "M&A Due Diligence", "Restructuring", "Risk", "HR & Organization", "Public Sector"] },
  am: { label: "Asset Management", verts: ["Equities", "Fixed Income", "Multi-Asset", "Alternatives", "ETF / Passive", "Wealth Management", "Endowment / Foundation", "Pension Fund"] },
  re: { label: "Real Estate", verts: ["Acquisitions", "Asset Management", "Development", "Debt / Lending", "REITs", "Real Estate PE", "Property Management", "Valuations"] },
};

type Filters = { firm: string | null; role: string | null; group: string | null; school: string | null };

const GROUP_CATEGORIES = [
  { key: "ib", label: "IB" },
  { key: "pe", label: "PE" },
  { key: "hf", label: "HF" },
  { key: "vc", label: "VC" },
  { key: "st", label: "Sales & Trading" },
  { key: "er", label: "Equity Research" },
  { key: "con", label: "Consulting" },
  { key: "other", label: "Other" },
] as const;

const OTHER_VERTICALS = [
  "Asset Management",
  "Equities",
  "Fixed Income",
  "Real Estate",
  "Acquisitions",
  "Development",
];

const FIRMS = [
  "Goldman Sachs", "J.P. Morgan", "Morgan Stanley", "Evercore", "Lazard", "Centerview Partners", "PJT Partners", "Moelis", "Guggenheim Partners", "Houlihan Lokey",
  "William Blair", "Raymond James", "Jefferies", "RBC Capital Markets", "Barclays", "Citi", "Bank of America", "UBS", "Deutsche Bank", "Wells Fargo",
  "Macquarie", "Nomura", "Cowen", "Stifel", "Piper Sandler", "Canaccord Genuity", "Lincoln International", "Harris Williams", "Robert W. Baird", "Stephens Inc.",
  "Blackstone", "KKR", "Apollo Global Management", "Carlyle", "Ares Management", "TPG", "Thoma Bravo", "Vista Equity", "Advent International", "Hellman & Friedman",
  "Silver Lake", "General Atlantic", "Warburg Pincus", "EQT", "CVC Capital", "Cinven", "Permira", "Clayton Dubilier & Rice", "Insight Partners", "Tiger Global",
  "McKinsey & Company", "Boston Consulting Group", "Bain & Company", "Deloitte", "EY", "PwC", "KPMG", "LEK", "Oliver Wyman", "Strategy&", "Accenture", "Alvarez & Marsal",
];

const SCHOOLS = [
  "Wharton", "Harvard Business School", "Stanford GSB", "Columbia Business School", "MIT Sloan", "Chicago Booth", "Kellogg", "NYU Stern", "Yale SOM", "Tuck", "Fuqua", "Ross", "Darden", "Anderson", "Haas", "Johnson (Cornell)", "Tepper", "McDonough", "Marshall", "McCombs", "Kenan-Flagler", "Foster", "Mendoza", "Smeal", "Kelley", "Wisconsin", "Indiana", "Ohio State", "Penn State", "BYU Marriott",
  "Georgetown", "Notre Dame", "Vanderbilt (Owen)", "Emory (Goizueta)", "Rice (Jones)", "Washington Univ (Olin)", "Boston College", "Carnegie Mellon", "Duke", "UNC", "Texas A&M", "Michigan State", "Purdue", "Minnesota", "Illinois", "Iowa", "Florida", "Georgia Tech", "UVA", "William & Mary", "Babson", "Boston University", "Brandeis", "Fordham", "Syracuse", "Rochester (Simon)", "USC (Marshall)", "UCLA", "UC Berkeley", "Washington (Foster)", "Arizona State", "Utah", "Brigham Young",
];

export default function ContactFinderPage() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const [filters, setFilters] = useState<Filters>({ firm: null, role: null, group: null, school: null });
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<DisplayContact[]>([]);
  const [hasSearched, setHasSearched] = useState(false);
  const [searchesLeft, setSearchesLeft] = useState(15);
  const [activeCat, setActiveCat] = useState<string>("ib");
  const [selectedGroup, setSelectedGroup] = useState<string | null>(null);
  const [firmSearch, setFirmSearch] = useState("");
  const [schoolSearch, setSchoolSearch] = useState("");
  const [toast, setToast] = useState("");

  const firmsFiltered = FIRMS.filter((f) =>
    f.toLowerCase().includes(firmSearch.trim().toLowerCase())
  );
  const schoolsFiltered = SCHOOLS.filter((s) =>
    s.toLowerCase().includes(schoolSearch.trim().toLowerCase())
  );

  useEffect(() => {
    if (typeof window === "undefined") return;
    const stored = window.localStorage.getItem("kynect_user_id");
    if (!stored) {
      router.replace("/signin");
      return;
    }
  }, [router]);

  const [isDark, setIsDark] = useState(false);
  useEffect(() => {
    if (typeof window === "undefined") return;
    const saved = localStorage.getItem("kynect-theme");
    if (saved) {
      document.documentElement.setAttribute("data-theme", saved);
      setIsDark(saved === "dark");
    }
  }, []);

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      const el = e.target as HTMLElement;
      if (el.closest?.(".filter-chip") || el.closest?.(".filter-dropdown")) return;
      setOpenDropdown(null);
    };
    document.addEventListener("click", handleClick);
    return () => document.removeEventListener("click", handleClick);
  }, []);

  const toggleTheme = () => {
    const html = document.documentElement;
    const next = html.getAttribute("data-theme") === "dark" ? "light" : "dark";
    html.setAttribute("data-theme", next);
    setIsDark(next === "dark");
    if (typeof window !== "undefined") localStorage.setItem("kynect-theme", next);
  };

  const toggleDropdown = (key: string) => {
    if (openDropdown !== key) {
      if (key === "firm") setFirmSearch("");
      if (key === "school") setSchoolSearch("");
    }
    setOpenDropdown((prev) => (prev === key ? null : key));
  };

  const selectFilter = (key: keyof Filters, val: string) => {
    setFilters((prev) => ({
      ...prev,
      [key]: prev[key] === val ? null : val,
    }));
    setOpenDropdown(null);
  };

  const clearFilters = () => {
    setFilters({ firm: null, role: null, group: null, school: null });
    setSelectedGroup(null);
    setOpenDropdown(null);
  };

  const runSearch = async () => {
    const query = searchQuery.trim();
    if (!query && !Object.values(filters).some(Boolean)) return;
    if (searchesLeft <= 0) {
      setToast("No searches remaining — upgrade to Pro");
      setTimeout(() => setToast(""), 2800);
      return;
    }
    setLoading(true);
    setHasSearched(true);
    try {
      const res = await fetch("/api/search-contacts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          query,
          filters: {
            firm: filters.firm ?? undefined,
            role: filters.role ?? undefined,
          },
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        setToast("No contacts found — try a different search term");
        setTimeout(() => setToast(""), 2800);
        setResults([]);
        return;
      }
      const contacts: ApiContact[] = Array.isArray(data.contacts) ? data.contacts : [];
      setResults(contacts.map((c, i) => displayContactFromApi(c, i)));
      setSearchesLeft((n) => Math.max(0, n - 1));
    } catch {
      setToast("No contacts found — try a different search term");
      setTimeout(() => setToast(""), 2800);
      setResults([]);
    } finally {
      setLoading(false);
    }
  };

  const applyGroupCatOnly = () => {
    const label = activeCat === "other" ? "Other" : (GROUP_VERTICALS[activeCat]?.label ?? "");
    setFilters((prev) => ({ ...prev, group: label }));
    setOpenDropdown(null);
  };

  const applyGroupVertical = () => {
    if (selectedGroup) {
      setFilters((prev) => ({ ...prev, group: selectedGroup }));
    } else {
      applyGroupCatOnly();
      return;
    }
    setOpenDropdown(null);
  };

  const selectGroupVertical = (vert: string) => {
    setSelectedGroup((prev) => (prev === vert ? null : vert));
  };

  const groupVerticalsList = activeCat === "other" ? OTHER_VERTICALS : (GROUP_VERTICALS[activeCat]?.verts ?? []);
  const groupCategoryLabel = activeCat === "other" ? "Other" : (GROUP_VERTICALS[activeCat]?.label ?? "");

  const copyEmail = (email: string) => {
    if (typeof navigator !== "undefined" && navigator.clipboard) {
      navigator.clipboard.writeText(email).then(() => setToast("Email copied — " + email));
      setTimeout(() => setToast(""), 2800);
    }
  };

  const hasAnyFilter = Object.values(filters).some(Boolean);
  const usagePipClass = searchesLeft <= 3 ? "usage-pip danger" : searchesLeft <= 7 ? "usage-pip warn" : "usage-pip";

  return (
    <div className="app">
      <aside className="sidebar">
        <div className="sidebar-logo">
          <Link href="/" style={{ color: "inherit", textDecoration: "none" }}>Kynect<em>.</em></Link>
        </div>
        <div className="sidebar-user">
          <div className="user-avi">AC</div>
          <div>
            <div className="user-name-text">Alex Chen</div>
            <div className="user-plan-text">Free plan</div>
          </div>
          <span className="user-settings">⚙</span>
        </div>
        <nav className="nav">
          <div className="nav-group">
            <span className="nav-group-label">Overview</span>
            <Link className="nav-item" href="/dashboard">
              <svg className="nav-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <rect x="3" y="3" width="7" height="7" rx="1.5" />
                <rect x="14" y="3" width="7" height="7" rx="1.5" />
                <rect x="3" y="14" width="7" height="7" rx="1.5" />
                <rect x="14" y="14" width="7" height="7" rx="1.5" />
              </svg>
              Dashboard
            </Link>
          </div>
          <div className="nav-group">
            <span className="nav-group-label">Tools</span>
            <Link className="nav-item active" href="/contact-finder">
              <svg className="nav-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <circle cx="11" cy="11" r="8" />
                <path d="m21 21-4.35-4.35" />
              </svg>
              Contact Finder
              <span className="nav-pill pill-count">15 left</span>
            </Link>
            <Link className="nav-item" href="#">
              <svg className="nav-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
              </svg>
              Outreach Writer
              <span className="nav-pill pill-count">10 left</span>
            </Link>
            <Link className="nav-item" href="#">
              <svg className="nav-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path d="M9 11l3 3L22 4" />
                <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11" />
              </svg>
              Outreach Tracker
            </Link>
            <Link className="nav-item" href="#">
              <svg className="nav-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <rect x="2" y="7" width="20" height="14" rx="2" />
                <path d="M16 7V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2" />
              </svg>
              Job Board
            </Link>
          </div>
          <div className="nav-group">
            <span className="nav-group-label">Intelligence</span>
            <Link className="nav-item" href="#">
              <svg className="nav-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
              </svg>
              Hit Rate Intel
              <span className="nav-pill pill-pro">Pro</span>
            </Link>
            <Link className="nav-item" href="#">
              <svg className="nav-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path d="M12 20h9" />
                <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z" />
              </svg>
              Coach
              <span className="nav-pill pill-pro">Pro</span>
            </Link>
          </div>
          <div className="nav-group">
            <span className="nav-group-label">Learn</span>
            <Link className="nav-item" href="#">
              <svg className="nav-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
                <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
              </svg>
              Recruiting Manual
            </Link>
          </div>
          <div className="nav-group">
            <span className="nav-group-label">Account</span>
            <Link className="nav-item" href="#">
              <svg className="nav-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                <circle cx="12" cy="7" r="4" />
              </svg>
              My Account
            </Link>
          </div>
        </nav>
        <div className="theme-toggle-row">
          <span className="theme-toggle-label">
            <svg width="14" height="14" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
            </svg>
            Dark mode
          </span>
          <button
            className={"toggle-switch" + (isDark ? " on" : "")}
            onClick={toggleTheme}
            type="button"
          >
            <div className="toggle-knob" />
          </button>
        </div>
        <div className="sidebar-footer">
          <div className="upgrade-card">
            <div className="upgrade-card-title">Unlock Pro</div>
            <div className="upgrade-card-desc">Unlimited searches, hit rate data, AI coaching.</div>
            <a href="#" className="upgrade-card-btn">Go Pro — $12/mo</a>
          </div>
        </div>
      </aside>

      <main className="main">
        <div className="page-header">
          <div className="page-title">Contact <em>Finder</em></div>
          <div className="page-sub">Search our database of finance professionals. Get verified emails and LinkedIn profiles instantly.</div>
          <div className="usage-pill">
            <span className={usagePipClass} />
            <span>{searchesLeft} search{searchesLeft !== 1 ? "es" : ""} remaining this month</span>
          </div>
        </div>

        <div className="search-section">
          <div className="search-row">
            <div className="search-input-wrap">
              <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <circle cx="11" cy="11" r="8" />
                <path d="m21 21-4.35-4.35" />
              </svg>
              <input
                className="search-input"
                type="text"
                placeholder="Search by name, firm, role, or school… e.g. 'Goldman Sachs investment banking'"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && runSearch()}
              />
            </div>
            <button className="search-btn" onClick={runSearch} type="button">
              Search →
            </button>
          </div>
          <div className="filter-row">
            <span className="filter-label">Filter:</span>

            <div
              className={"filter-chip" + (openDropdown === "firm" ? " open" : "") + (filters.firm ? " active" : "")}
              onClick={(e) => { e.stopPropagation(); toggleDropdown("firm"); }}
            >
              <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <rect x="2" y="7" width="20" height="14" rx="2" />
                <path d="M16 7V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2" />
              </svg>
              {filters.firm ?? "Firm"}
              <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <polyline points="6 9 12 15 18 9" />
              </svg>
              <div className="filter-dropdown" id="dd-firm" style={{ minWidth: 220 }} onClick={(e) => e.stopPropagation()}>
                <div className="filter-dropdown-search">
                  <input
                    type="text"
                    className="filter-search-input"
                    placeholder="Search firms…"
                    value={firmSearch}
                    onChange={(e) => setFirmSearch(e.target.value)}
                    onClick={(e) => e.stopPropagation()}
                  />
                </div>
                <div className="filter-dropdown-list">
                  {firmsFiltered.length === 0 ? (
                    <div className="filter-no-results">No results</div>
                  ) : (
                    firmsFiltered.map((f) => (
                      <div key={f} className={"filter-option" + (filters.firm === f ? " selected" : "")} onClick={(e) => { e.stopPropagation(); selectFilter("firm", f); }}>
                        {f}
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>

            <div className={"filter-chip" + (openDropdown === "role" ? " open" : "") + (filters.role ? " active" : "")} onClick={(e) => { e.stopPropagation(); toggleDropdown("role"); }}>
              <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                <circle cx="12" cy="7" r="4" />
              </svg>
              {filters.role ?? "Role"}
              <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <polyline points="6 9 12 15 18 9" />
              </svg>
              <div className="filter-dropdown" id="dd-role">
                {["Analyst", "Associate", "VP", "Director", "MD", "Partner"].map((r) => (
                  <div key={r} className={"filter-option" + (filters.role === r ? " selected" : "")} onClick={(e) => { e.stopPropagation(); selectFilter("role", r); }}>
                    {r}
                  </div>
                ))}
              </div>
            </div>

            <div className={"filter-chip" + (openDropdown === "group" ? " open" : "") + (filters.group ? " active" : "")} onClick={(e) => { e.stopPropagation(); toggleDropdown("group"); }}>
              <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
              </svg>
              {filters.group ? (filters.group.length > 22 ? filters.group.slice(0, 22) + "…" : filters.group) : "Group"}
              <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <polyline points="6 9 12 15 18 9" />
              </svg>
              <div className="filter-dropdown two-level" style={{ minWidth: 480 }} onClick={(e) => e.stopPropagation()}>
                <div className="two-level-inner">
                  <div className="tl-cats">
                    <div className="tl-cat-label">Category</div>
                    {GROUP_CATEGORIES.map(({ key, label }) => (
                      <div
                        key={key}
                        className={"tl-cat" + (activeCat === key ? " active" : "")}
                        onClick={(e) => { e.stopPropagation(); setActiveCat(key); setSelectedGroup(null); }}
                      >
                        {label}
                      </div>
                    ))}
                  </div>
                  <div className="tl-verticals">
                    <div className="tl-vert-label">Vertical</div>
                    <div className="tl-verts">
                      {groupVerticalsList.map((v) => (
                        <div key={v} className={"tl-vert" + (selectedGroup === v ? " selected" : "")} onClick={(e) => { e.stopPropagation(); selectGroupVertical(v); }}>
                          {v}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
                <div className="tl-footer">
                  <span style={{ fontSize: 11, color: "var(--text-3)" }}>
                    {selectedGroup ? groupCategoryLabel + " → " + selectedGroup : "Select a vertical or pick a category only"}
                  </span>
                  <div style={{ display: "flex", gap: 6 }}>
                    <button className="tl-btn-ghost" onClick={(e) => { e.stopPropagation(); applyGroupCatOnly(); }} type="button">
                      Category only
                    </button>
                    <button className="tl-btn-solid" onClick={(e) => { e.stopPropagation(); applyGroupVertical(); }} type="button">
                      Apply
                    </button>
                  </div>
                </div>
              </div>
            </div>

            <div className={"filter-chip" + (openDropdown === "school" ? " open" : "") + (filters.school ? " active" : "")} onClick={(e) => { e.stopPropagation(); toggleDropdown("school"); }}>
              <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
                <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
              </svg>
              {filters.school ?? "School"}
              <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <polyline points="6 9 12 15 18 9" />
              </svg>
              <div className="filter-dropdown" id="dd-school" style={{ minWidth: 220 }} onClick={(e) => e.stopPropagation()}>
                <div className="filter-dropdown-search">
                  <input
                    type="text"
                    className="filter-search-input"
                    placeholder="Search schools…"
                    value={schoolSearch}
                    onChange={(e) => setSchoolSearch(e.target.value)}
                    onClick={(e) => e.stopPropagation()}
                  />
                </div>
                <div className="filter-dropdown-list">
                  {schoolsFiltered.length === 0 ? (
                    <div className="filter-no-results">No results</div>
                  ) : (
                    schoolsFiltered.map((s) => (
                      <div key={s} className={"filter-option" + (filters.school === s ? " selected" : "")} onClick={(e) => { e.stopPropagation(); selectFilter("school", s); }}>
                        {s}
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>

            {hasAnyFilter && (
              <div className="filter-chip" onClick={clearFilters} style={{ display: "flex", color: "#dc2626", borderColor: "#fecaca" }}>
                × Clear filters
              </div>
            )}
          </div>
        </div>

        <div id="results-area">
          {loading && (
            <>
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="skeleton-card" style={{ marginBottom: 10 }}>
                  <div className="sk-circle skeleton" />
                  <div className="sk-lines">
                    <div className="sk-line skeleton" style={{ width: "40%" }} />
                    <div className="sk-line skeleton" style={{ width: "65%" }} />
                    <div className="sk-line skeleton" style={{ width: "30%" }} />
                  </div>
                </div>
              ))}
            </>
          )}
          {!loading && !hasSearched && (
            <div className="empty-state">
              <div className="empty-icon">🔍</div>
              <div className="empty-title">Search for anyone in finance</div>
              <div className="empty-sub">Try searching &quot;Goldman Sachs investment banking New York&quot; or &quot;Blackstone PE associate NYU&quot; to find verified contacts.</div>
            </div>
          )}
          {!loading && hasSearched && results.length === 0 && (
            <div className="empty-state">
              <div className="empty-icon">🤷</div>
              <div className="empty-title">No contacts found</div>
              <div className="empty-sub">Try a different search term or adjust your filters.</div>
            </div>
          )}
          {!loading && hasSearched && results.length > 0 && (
            <>
              <div className="results-header">
                <div className="results-count">{results.length} contact{results.length !== 1 ? "s" : ""} found</div>
              </div>
              <div className="contacts-grid">
                {results.map((c, i) => {
                  const isLocked = !c.verified;
                  const emailDisplay = c.verified
                    ? c.email
                    : "••••••@••••.•••";
                  return (
                    <div key={c.id} className={"contact-card" + (isLocked ? " locked" : "")} style={{ animationDelay: i * 0.05 + "s" }}>
                      <div className="contact-avi" style={{ background: c.color }}>
                        {c.initials}
                      </div>
                      <div className="contact-info">
                        <div className="contact-name">{c.name}</div>
                        <div className="contact-role">{c.role} · {c.firm} · {c.location}</div>
                        <div className="contact-tags">
                          <span className="ctag ctag-firm">{c.group}</span>
                          {c.school !== "—" && <span className="ctag ctag-school">{c.school} &apos;{c.year.slice(-2)}</span>}
                          {c.verified ? <span className="ctag ctag-verified">✓ Verified</span> : <span className="lock-badge">🔒 Pro</span>}
                        </div>
                        <div className="contact-email-row">
                          <span className="email-text">{emailDisplay}</span>
                          {c.verified && c.email && (
                            <button className="copy-btn" onClick={() => copyEmail(c.email)} type="button">
                              Copy
                            </button>
                          )}
                        </div>
                      </div>
                      <div className="contact-actions">
                        <button
                          className="action-btn action-btn-outline"
                          type="button"
                          onClick={() => c.linkedin ? window.open(c.linkedin.startsWith("http") ? c.linkedin : "https://" + c.linkedin, "_blank") : setToast("Opening LinkedIn profile…")}
                        >
                          <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
                            <rect x="2" y="9" width="4" height="12" />
                            <circle cx="4" cy="4" r="2" />
                          </svg>
                          LinkedIn
                        </button>
                        <button className="action-btn action-btn-solid" type="button" onClick={() => setToast("Opening Outreach Writer for " + c.name + "…")}>
                          <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
                          </svg>
                          Write Outreach
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </>
          )}
        </div>
      </main>

      <div className={"toast" + (toast ? " show" : "")} id="toast">
        {toast}
      </div>
    </div>
  );
}
