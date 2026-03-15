"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import FilterPills from "./FilterPills";
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

type Filters = { firm: string[]; role: string[]; location: string[]; vertical: string[]; school: string[] };

export default function ContactFinderPage() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const [filters, setFilters] = useState<Filters>({ firm: [], role: [], location: [], vertical: [], school: [] });
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<DisplayContact[]>([]);
  const [hasSearched, setHasSearched] = useState(false);
  const [searchesLeft, setSearchesLeft] = useState(15);
  const [toast, setToast] = useState("");

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

  const toggleTheme = () => {
    const html = document.documentElement;
    const next = html.getAttribute("data-theme") === "dark" ? "light" : "dark";
    html.setAttribute("data-theme", next);
    setIsDark(next === "dark");
    if (typeof window !== "undefined") localStorage.setItem("kynect-theme", next);
  };

  const runSearch = async () => {
    const query = searchQuery.trim();
    const hasFilters = filters.firm.length > 0 || filters.role.length > 0 || filters.location.length > 0 || filters.vertical.length > 0 || filters.school.length > 0;
    if (!query && !hasFilters) return;
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
            firm: filters.firm.length ? filters.firm : undefined,
            role: filters.role.length ? filters.role : undefined,
            location: filters.location.length ? filters.location : undefined,
            group: filters.vertical.length ? filters.vertical : undefined,
            school: filters.school.length ? filters.school : undefined,
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


  const copyEmail = (email: string) => {
    if (typeof navigator !== "undefined" && navigator.clipboard) {
      navigator.clipboard.writeText(email).then(() => setToast("Email copied — " + email));
      setTimeout(() => setToast(""), 2800);
    }
  };

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
            <FilterPills filters={filters} onChange={setFilters} />
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
                            <button className="copy-btn" onMouseDown={(e) => { e.preventDefault(); e.stopPropagation(); copyEmail(c.email); }} type="button">
                              Copy
                            </button>
                          )}
                        </div>
                      </div>
                      <div className="contact-actions">
                        <button
                          className="action-btn action-btn-outline"
                          type="button"
                          onMouseDown={(e) => { e.preventDefault(); e.stopPropagation(); c.linkedin ? window.open(c.linkedin.startsWith("http") ? c.linkedin : "https://" + c.linkedin, "_blank") : setToast("Opening LinkedIn profile…"); }}
                        >
                          <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
                            <rect x="2" y="9" width="4" height="12" />
                            <circle cx="4" cy="4" r="2" />
                          </svg>
                          LinkedIn
                        </button>
                        <button className="action-btn action-btn-solid" type="button" onMouseDown={(e) => { e.preventDefault(); e.stopPropagation(); setToast("Opening Outreach Writer for " + c.name + "…"); }}>
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
