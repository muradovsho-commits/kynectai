export default function ContactFinder() {
  return (
    <>
      {/* SIDEBAR */}
      <aside className="sidebar">
        <div className="sidebar-top">
          <div className="sidebar-wordmark">
            Kynect<em>.</em>
          </div>
          <div className="sidebar-tagline">Finance recruiting toolkit</div>
        </div>
        <nav className="sidebar-nav">
          <div className="nav-group-label">Main</div>
          <a href="/" className="nav-item">
            <svg
              className="nav-icon"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              viewBox="0 0 24 24"
            >
              <rect x="3" y="3" width="7" height="7" rx="1" />
              <rect x="14" y="3" width="7" height="7" rx="1" />
              <rect x="3" y="14" width="7" height="7" rx="1" />
              <rect x="14" y="14" width="7" height="7" rx="1" />
            </svg>
            Home
          </a>
          <a href="/contact-finder" className="nav-item active">
            <svg
              className="nav-icon"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              viewBox="0 0 24 24"
            >
              <circle cx="11" cy="11" r="8" />
              <path d="m21 21-4.35-4.35" />
            </svg>
            Contact Finder
            <span className="nav-badge badge-count">14 left</span>
          </a>
          <a href="#" className="nav-item">
            <svg
              className="nav-icon"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              viewBox="0 0 24 24"
            >
              <path d="M12 20h9" />
              <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z" />
            </svg>
            Outreach Writer
            <span className="nav-badge badge-count">10 left</span>
          </a>
          <a href="#" className="nav-item">
            <svg
              className="nav-icon"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              viewBox="0 0 24 24"
            >
              <path d="M9 11l3 3L22 4" />
              <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11" />
            </svg>
            Pipeline
          </a>
          <div className="nav-group-label">Discover</div>
          <a href="#" className="nav-item">
            <svg
              className="nav-icon"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              viewBox="0 0 24 24"
            >
              <rect x="2" y="7" width="20" height="14" rx="2" />
              <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
            </svg>
            Job Board
          </a>
          <a href="#" className="nav-item">
            <svg
              className="nav-icon"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              viewBox="0 0 24 24"
            >
              <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
            </svg>
            Hit Rate Intel
            <span className="nav-badge badge-pro">Pro</span>
          </a>
          <a href="#" className="nav-item">
            <svg
              className="nav-icon"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              viewBox="0 0 24 24"
            >
              <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
            </svg>
            Coach
            <span className="nav-badge badge-pro">Pro</span>
          </a>
          <a href="#" className="nav-item">
            <svg
              className="nav-icon"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              viewBox="0 0 24 24"
            >
              <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" />
              <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" />
            </svg>
            Recruiting Guide
          </a>
        </nav>
        <div className="sidebar-bottom">
          <div className="upgrade-card">
            <div className="upgrade-title">Upgrade to Pro</div>
            <div className="upgrade-desc">
              Unlimited searches, reply rate data, and AI coaching.
            </div>
            <a href="#" className="upgrade-btn">
              Go Pro — $12/mo
            </a>
          </div>
          <div className="user-strip">
            <div className="user-av">SM</div>
            <div>
              <div className="user-name">Shoh Muradov</div>
              <div className="user-plan">Free plan</div>
            </div>
          </div>
        </div>
      </aside>

      {/* MAIN */}
      <div className="main">
        {/* TOPBAR */}
        <div className="topbar">
          <div className="topbar-left">
            <div className="topbar-title">
              Contact <em>Finder</em>
            </div>
            <div className="topbar-sub">
              Find verified emails and LinkedIn profiles at your target firms.
            </div>
          </div>
          <div className="topbar-actions">
            <span className="searches-left">
              <strong>14</strong> searches left this month
            </span>
            <a href="#" className="tbtn tbtn-ghost">
              <svg
                width="12"
                height="12"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                viewBox="0 0 24 24"
              >
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                <polyline points="17 8 12 3 7 8" />
                <line x1="12" y1="3" x2="12" y2="15" />
              </svg>
              Import list
            </a>
          </div>
        </div>

        {/* PAGE CONTENT */}
        <div className="page">
          {/* Usage banner */}
          <div className="usage-banner">
            <div className="usage-banner-text">
              <strong>Free plan:</strong> 1 of 15 searches used this month. Each
              search costs 1 credit and returns up to 10 contacts.
            </div>
            <a href="#" className="usage-upgrade">
              Unlock unlimited →
            </a>
          </div>

          {/* Search bar */}
          <div className="search-section">
            <div className="search-label">Search contacts</div>
            <div className="search-bar-wrap">
              <div className="search-bar">
                <svg
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                >
                  <circle cx="11" cy="11" r="8" />
                  <path d="m21 21-4.35-4.35" />
                </svg>
                <input
                  type="text"
                  placeholder={`Try "Goldman Sachs IB analysts" or "PE associates NYC"`}
                  defaultValue="Goldman Sachs investment banking analysts New York"
                />
                <div className="search-bar-divider" />
                <svg
                  width="14"
                  height="14"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                  style={{
                    color: "var(--g400)",
                    flexShrink: 0,
                    marginLeft: 4,
                  }}
                >
                  <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                  <circle cx="9" cy="7" r="4" />
                  <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
                  <path d="M16 3.13a4 4 0 0 1 0 7.75" />
                </svg>
                <input
                  type="text"
                  placeholder="School (optional)"
                  style={{ maxWidth: 140, color: "var(--g600)" }}
                />
              </div>
              <button className="search-btn" type="button">
                <svg
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  viewBox="0 0 24 24"
                >
                  <circle cx="11" cy="11" r="8" />
                  <path d="m21 21-4.35-4.35" />
                </svg>
                Search
              </button>
            </div>
          </div>

          {/* Filters */}
          <div className="filter-row">
            <div className="filter-group">
              <span className="filter-label">Sector</span>
              <select className="filter-select" defaultValue="Investment Banking">
                <option>All sectors</option>
                <option>Investment Banking</option>
                <option>Private Equity</option>
                <option>Hedge Fund</option>
                <option>Growth Equity</option>
                <option>Consulting</option>
              </select>
            </div>
            <div className="filter-group">
              <span className="filter-label">Seniority</span>
              <select className="filter-select" defaultValue="Analyst">
                <option>All levels</option>
                <option>Analyst</option>
                <option>Associate</option>
                <option>VP</option>
                <option>MD / Partner</option>
              </select>
            </div>
            <div className="filter-group">
              <span className="filter-label">Location</span>
              <select className="filter-select" defaultValue="New York">
                <option>New York</option>
                <option>Chicago</option>
                <option>San Francisco</option>
                <option>Boston</option>
                <option>Any</option>
              </select>
            </div>
            <div className="filter-divider" />
            <span className="filter-pill active-green">✓ Verified email only</span>
            <span className="filter-pill">Alumni match</span>
            <span className="filter-pill">Has LinkedIn</span>
            <span className="filter-count">Showing 7 results</span>
          </div>

          {/* Results + right panel */}
          <div className="results-layout">
            {/* Results list */}
            <div className="results-card">
              <div className="results-header">
                <span className="results-title">
                  Goldman Sachs · IB Analysts · New York
                </span>
                <span className="results-meta">
                  7 contacts found · 1 search used
                </span>
              </div>
              <div className="results-cols">
                <div className="col-h">Name</div>
                <div className="col-h">Firm</div>
                <div className="col-h">Role</div>
                <div className="col-h">Verified</div>
                <div className="col-h">Actions</div>
              </div>

              {/* Row 1 selected */}
              <div className="result-row selected">
                <div className="r-person">
                  <div
                    className="r-av"
                    style={{
                      background:
                        "linear-gradient(135deg,#667eea,#764ba2)",
                    }}
                  >
                    EZ
                  </div>
                  <div>
                    <div className="r-name">Emily Zhang</div>
                    <div className="r-school">UMich Ross &apos;23</div>
                  </div>
                </div>
                <div>
                  <div className="r-firm">Goldman Sachs</div>
                  <div className="r-loc">New York, NY</div>
                </div>
                <div className="r-role">IB Analyst · TMT</div>
                <div className="r-tags">
                  <span className="rtag rtag-li">LI</span>
                  <span className="rtag rtag-em">Email</span>
                  <span className="rtag rtag-v">✓</span>
                </div>
                <div className="r-actions">
                  <button className="r-act-btn r-act-write" type="button">
                    Write →
                  </button>
                  <button className="r-act-btn r-act-save" type="button">
                    Save
                  </button>
                </div>
              </div>

              {/* Remaining rows (static) */}
              <div className="result-row">
                <div className="r-person">
                  <div
                    className="r-av"
                    style={{
                      background:
                        "linear-gradient(135deg,#f59e0b,#ef4444)",
                    }}
                  >
                    MC
                  </div>
                  <div>
                    <div className="r-name">Marcus Chen</div>
                    <div className="r-school">Wharton &apos;22</div>
                  </div>
                </div>
                <div>
                  <div className="r-firm">Goldman Sachs</div>
                  <div className="r-loc">New York, NY</div>
                </div>
                <div className="r-role">IB Analyst · FIG</div>
                <div className="r-tags">
                  <span className="rtag rtag-li">LI</span>
                  <span className="rtag rtag-em">Email</span>
                  <span className="rtag rtag-v">✓</span>
                </div>
                <div className="r-actions">
                  <button className="r-act-btn r-act-write" type="button">
                    Write →
                  </button>
                  <button className="r-act-btn r-act-save" type="button">
                    Save
                  </button>
                </div>
              </div>

              <div className="result-row">
                <div className="r-person">
                  <div
                    className="r-av"
                    style={{
                      background:
                        "linear-gradient(135deg,#22c55e,#16a34a)",
                    }}
                  >
                    SP
                  </div>
                  <div>
                    <div className="r-name">Sarah Park</div>
                    <div className="r-school">Columbia &apos;23</div>
                  </div>
                </div>
                <div>
                  <div className="r-firm">Goldman Sachs</div>
                  <div className="r-loc">New York, NY</div>
                </div>
                <div className="r-role">IB Analyst · Healthcare</div>
                <div className="r-tags">
                  <span className="rtag rtag-li">LI</span>
                  <span className="rtag rtag-em">Email</span>
                  <span className="rtag rtag-v">✓</span>
                </div>
                <div className="r-actions">
                  <button className="r-act-btn r-act-write" type="button">
                    Write →
                  </button>
                  <button className="r-act-btn r-act-save" type="button">
                    Save
                  </button>
                </div>
              </div>

              <div className="result-row">
                <div className="r-person">
                  <div
                    className="r-av"
                    style={{
                      background:
                        "linear-gradient(135deg,#3b82f6,#1d4ed8)",
                    }}
                  >
                    JL
                  </div>
                  <div>
                    <div className="r-name">Jordan Lee</div>
                    <div className="r-school">NYU Stern &apos;23</div>
                  </div>
                </div>
                <div>
                  <div className="r-firm">Goldman Sachs</div>
                  <div className="r-loc">New York, NY</div>
                </div>
                <div className="r-role">IB Analyst · Consumer</div>
                <div className="r-tags">
                  <span className="rtag rtag-li">LI</span>
                  <span className="rtag rtag-v">✓</span>
                </div>
                <div className="r-actions">
                  <button className="r-act-btn r-act-write" type="button">
                    Write →
                  </button>
                  <button className="r-act-btn r-act-save" type="button">
                    Save
                  </button>
                </div>
              </div>

              <div className="result-row">
                <div className="r-person">
                  <div
                    className="r-av"
                    style={{
                      background:
                        "linear-gradient(135deg,#ec4899,#f43f5e)",
                    }}
                  >
                    AK
                  </div>
                  <div>
                    <div className="r-name">Aiden Kim</div>
                    <div className="r-school">Harvard &apos;22</div>
                  </div>
                </div>
                <div>
                  <div className="r-firm">Goldman Sachs</div>
                  <div className="r-loc">New York, NY</div>
                </div>
                <div className="r-role">IB Analyst · Industrials</div>
                <div className="r-tags">
                  <span className="rtag rtag-li">LI</span>
                  <span className="rtag rtag-em">Email</span>
                  <span className="rtag rtag-v">✓</span>
                </div>
                <div className="r-actions">
                  <button className="r-act-btn r-act-write" type="button">
                    Write →
                  </button>
                  <button className="r-act-btn r-act-save" type="button">
                    Save
                  </button>
                </div>
              </div>

              <div className="result-row">
                <div className="r-person">
                  <div
                    className="r-av"
                    style={{
                      background:
                        "linear-gradient(135deg,#a855f7,#7c3aed)",
                    }}
                  >
                    PN
                  </div>
                  <div>
                    <div className="r-name">Priya Nair</div>
                    <div className="r-school">Georgetown &apos;23</div>
                  </div>
                </div>
                <div>
                  <div className="r-firm">Goldman Sachs</div>
                  <div className="r-loc">New York, NY</div>
                </div>
                <div className="r-role">IB Analyst · Real Estate</div>
                <div className="r-tags">
                  <span className="rtag rtag-li">LI</span>
                  <span className="rtag rtag-em">Email</span>
                </div>
                <div className="r-actions">
                  <button className="r-act-btn r-act-write" type="button">
                    Write →
                  </button>
                  <button className="r-act-btn r-act-save" type="button">
                    Save
                  </button>
                </div>
              </div>

              <div className="result-row">
                <div className="r-person">
                  <div
                    className="r-av"
                    style={{
                      background:
                        "linear-gradient(135deg,#06b6d4,#0284c7)",
                    }}
                  >
                    TW
                  </div>
                  <div>
                    <div className="r-name">Tyler Wong</div>
                    <div className="r-school">Yale &apos;22</div>
                  </div>
                </div>
                <div>
                  <div className="r-firm">Goldman Sachs</div>
                  <div className="r-loc">New York, NY</div>
                </div>
                <div className="r-role">IB Analyst · Energy</div>
                <div className="r-tags">
                  <span className="rtag rtag-li">LI</span>
                  <span className="rtag rtag-em">Email</span>
                  <span className="rtag rtag-v">✓</span>
                </div>
                <div className="r-actions">
                  <button className="r-act-btn r-act-write" type="button">
                    Write →
                  </button>
                  <button className="r-act-btn r-act-save" type="button">
                    Save
                  </button>
                </div>
              </div>
            </div>

            {/* Detail panel */}
            <div className="detail-panel">
              <div className="detail-card" style={{ marginBottom: 12 }}>
                <div className="dp-top">
                  <div className="dp-av">EZ</div>
                  <div>
                    <div className="dp-name">Emily Zhang</div>
                    <div className="dp-role">IB Analyst · TMT Coverage</div>
                    <div className="dp-firm">Goldman Sachs · New York</div>
                  </div>
                </div>
                <div className="dp-tags">
                  <span className="dp-tag dp-tag-li">LinkedIn</span>
                  <span className="dp-tag dp-tag-em">Email verified</span>
                  <span className="dp-tag dp-tag-v">✓ Confirmed</span>
                </div>
                <div className="dp-divider" />
                <div className="dp-field-label">Work email</div>
                <div className="dp-email-row" style={{ marginBottom: 12 }}>
                  <div className="dp-email">e.zhang@gs.com</div>
                  <button className="dp-copy" type="button">
                    Copy
                  </button>
                </div>
                <div className="dp-field-label" style={{ marginBottom: 6 }}>
                  LinkedIn
                </div>
                <a href="#" className="dp-linkedin">
                  <svg
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    viewBox="0 0 24 24"
                  >
                    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
                    <rect x="2" y="9" width="4" height="12" />
                    <circle cx="4" cy="4" r="2" />
                  </svg>
                  linkedin.com/in/emily-zhang-gs
                </a>
                <div className="dp-divider" />
                <div className="dp-field-label" style={{ marginBottom: 5 }}>
                  Background
                </div>
                <div
                  style={{
                    fontSize: 11,
                    color: "var(--g600)",
                    lineHeight: 1.65,
                  }}
                >
                  UMich Ross &apos;23 · IBC President · 2 yrs at Goldman TMT.
                  Focused on semiconductor and software M&amp;A. Previously
                  interned at William Blair Chicago.
                </div>
              </div>

              <div className="intel-card" style={{ marginBottom: 12 }}>
                <div className="intel-header">
                  <div className="intel-title">Contact Intelligence</div>
                  <span className="intel-badge">AI</span>
                </div>
                <div className="intel-summary">
                  Emily is a 2nd-year IB Analyst in Goldman&apos;s TMT coverage
                  group, focused on semiconductor and software M&amp;A. She
                  graduated from UMich Ross in 2023, was IBC President, and
                  responds well to specific deal references.
                </div>
                <div className="intel-starters-label">Conversation starters</div>
                <div className="intel-starter">
                  Ask about her path from UMich Ross IBC into Goldman&apos;s TMT
                  group.
                </div>
                <div className="intel-starter">
                  Reference her recent semiconductor M&amp;A coverage — she&apos;s
                  been active in that space.
                </div>
                <div className="intel-starter">
                  Mention her William Blair internship as a shared data point if
                  you&apos;re targeting similar firms.
                </div>
              </div>

              <div className="cta-card">
                <div className="cta-card-title">Ready to reach out?</div>
                <div className="cta-card-sub">
                  Kynect writes a personalized message using Emily&apos;s
                  background and your profile — not a template.
                </div>
                <button className="cta-card-btn" type="button">
                  <svg
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.5"
                    viewBox="0 0 24 24"
                  >
                    <path d="M12 20h9" />
                    <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z" />
                  </svg>
                  Write outreach for Emily
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

