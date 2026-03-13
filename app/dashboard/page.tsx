 "use client";

import { useEffect, useMemo, useState } from "react";
import { useQuery } from "convex/react";
import { useRouter } from "next/navigation";
import { api } from "../../convex/_generated/api";
import "./dashboard.css";

type User = {
  id?: string;
  name?: string;
  firstName?: string;
  lastName?: string;
  plan?: string;
  searchesUsed?: number;
  messagesUsed?: number;
};

export default function DashboardPage() {
  const router = useRouter();
  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const stored =
      window.localStorage.getItem("kynect_user_id") ??
      window.localStorage.getItem("userId");
    if (!stored) {
      router.replace("/signin");
      return;
    }
    setUserId(stored);
  }, [router]);

  const user = useQuery(
    (api as any).users?.getUser,
    userId ? { userId } : "skip",
  ) as User | undefined;

  const firstName = useMemo(() => {
    if (!user) return "there";
    if (user.firstName) return user.firstName;
    if (user.name) return user.name.split(" ")[0] ?? "there";
    return "there";
  }, [user]);

  const fullName = useMemo(() => {
    if (!user) return "—";
    if (user.name) return user.name;
    const parts = [user.firstName, user.lastName].filter(Boolean);
    return parts.length ? parts.join(" ") : "—";
  }, [user]);

  const searchesUsed = user?.searchesUsed ?? 0;
  const messagesUsed = user?.messagesUsed ?? 0;
  const searchesLimit = 15;
  const messagesLimit = 10;

  const searchesPct =
    searchesLimit > 0 ? Math.min(100, (searchesUsed / searchesLimit) * 100) : 0;
  const messagesPct =
    messagesLimit > 0 ? Math.min(100, (messagesUsed / messagesLimit) * 100) : 0;

  const initials = useMemo(() => {
    if (!fullName || fullName === "—") return "";
    return fullName
      .split(" ")
      .filter(Boolean)
      .slice(0, 2)
      .map((part) => part[0]?.toUpperCase() ?? "")
      .join("");
  }, [fullName]);

  const greetingPrefix = "Good morning";

  return (
    <div className="dashboard-root">
      {/* Sidebar */}
      <aside className="sidebar">
        <div className="sidebar-top">
          <div className="sidebar-wordmark">
            Kynect<em>.</em>
          </div>
          <div className="sidebar-tagline">Finance recruiting toolkit</div>
        </div>

        <nav className="sidebar-nav">
          <div className="nav-group-label">Main</div>
          <a className="nav-item active">
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
          <a className="nav-item">
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
            <span className="nav-badge badge-count">
              {Math.max(0, searchesLimit - searchesUsed)} left
            </span>
          </a>
          <a className="nav-item">
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
            <span className="nav-badge badge-count">
              {Math.max(0, messagesLimit - messagesUsed)} left
            </span>
          </a>
          <a className="nav-item">
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
          <a className="nav-item">
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
          <a className="nav-item">
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
          <a className="nav-item">
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
        </nav>

        <div className="sidebar-bottom">
          <div className="upgrade-card">
            <div className="upgrade-title">Upgrade to Pro</div>
            <div className="upgrade-desc">
              Unlimited searches, reply rate data, and AI coaching.
            </div>
            <a className="upgrade-btn">Go Pro — $12/mo</a>
          </div>
          <div className="user-strip">
            <div className="user-av">{initials || "?"}</div>
            <div>
              <div className="user-name">{fullName}</div>
              <div className="user-plan">{user?.plan ?? "Free plan"}</div>
            </div>
          </div>
        </div>
      </aside>

      {/* Main */}
      <div className="main-shell">
        <div className="topbar">
          <div className="topbar-left">
            <div className="topbar-greeting">
              {greetingPrefix},{" "}
              <em>{firstName}</em> 👋
            </div>
            <div className="topbar-sub">
              Here&apos;s how your networking looks this week.
            </div>
          </div>
          <div className="topbar-actions">
            <button className="tbtn tbtn-ghost">
              <svg
                width="12"
                height="12"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                viewBox="0 0 24 24"
              >
                <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                <circle cx="9" cy="7" r="4" />
                <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
                <path d="M16 3.13a4 4 0 0 1 0 7.75" />
              </svg>
              Add contact
            </button>
            <button className="tbtn tbtn-primary">
              <svg
                width="12"
                height="12"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                viewBox="0 0 24 24"
              >
                <circle cx="11" cy="11" r="8" />
                <path d="m21 21-4.35-4.35" />
              </svg>
              New search
            </button>
          </div>
        </div>

        <div className="content">
          {/* Stats row */}
          <div className="stats-row">
            <div className="stat-card">
              <div className="stat-label">Searches Used</div>
              <div className="stat-value">{searchesUsed}</div>
              <div className="stat-empty">
                {searchesUsed === 0
                  ? "No searches yet — find your first contact."
                  : null}
              </div>
              <div className="stat-bar">
                <div
                  className="stat-bar-fill"
                  style={{ width: `${searchesPct}%`, background: "#2563eb" }}
                />
              </div>
              <div style={{ fontSize: 10, color: "var(--g400)", marginTop: 6 }}>
                {searchesUsed} of {searchesLimit} this month
              </div>
            </div>

            <div className="stat-card">
              <div className="stat-label">Messages Sent</div>
              <div className="stat-value">{messagesUsed}</div>
              <div className="stat-empty">
                {messagesUsed === 0
                  ? "No messages yet — write your first outreach."
                  : null}
              </div>
              <div className="stat-bar">
                <div
                  className="stat-bar-fill"
                  style={{ width: `${messagesPct}%`, background: "#22c55e" }}
                />
              </div>
              <div style={{ fontSize: 10, color: "var(--g400)", marginTop: 6 }}>
                {messagesUsed} of {messagesLimit} this month
              </div>
            </div>

            <div className="stat-card">
              <div className="stat-label">Pipeline Contacts</div>
              <div className="stat-value">0</div>
              <div className="stat-empty">
                Contacts you&apos;ve reached out to will show here.
              </div>
              <div className="stat-bar">
                <div
                  className="stat-bar-fill"
                  style={{ width: "0%", background: "#d97706" }}
                />
              </div>
              <div style={{ fontSize: 10, color: "var(--g400)", marginTop: 6 }}>
                Across all stages
              </div>
            </div>

            <div className="stat-card">
              <div className="stat-label">Reply Rate</div>
              <div
                className="stat-value"
                style={{ fontSize: 20, color: "var(--g300)", paddingTop: 4 }}
              >
                —
              </div>
              <div className="stat-empty">
                Reply rate appears once you&apos;ve sent messages.
              </div>
              <div className="stat-bar">
                <div
                  className="stat-bar-fill"
                  style={{ width: "0%", background: "#b8860b" }}
                />
              </div>
              <div style={{ fontSize: 10, color: "var(--g400)", marginTop: 6 }}>
                Last 30 days
              </div>
            </div>
          </div>

          {/* Left column */}
          <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            {/* Quick actions */}
            <div>
              <div className="card-header" style={{ marginBottom: 10 }}>
                <div className="card-title">What do you want to do?</div>
              </div>
              <div className="quick-grid">
                <a className="q-card">
                  <div className="q-icon" style={{ background: "var(--blue-light)" }}>
                    <svg
                      fill="none"
                      stroke="#2563eb"
                      strokeWidth="2"
                      viewBox="0 0 24 24"
                    >
                      <circle cx="11" cy="11" r="8" />
                      <path d="m21 21-4.35-4.35" />
                    </svg>
                  </div>
                  <div style={{ paddingRight: 20 }}>
                    <div className="q-title">Find Contacts</div>
                    <div className="q-desc">
                      Search target firms and get verified emails + LinkedIn profiles.
                    </div>
                  </div>
                  <div className="q-arrow">→</div>
                </a>
                <a className="q-card">
                  <div className="q-icon" style={{ background: "var(--green-light)" }}>
                    <svg
                      fill="none"
                      stroke="#16a34a"
                      strokeWidth="2"
                      viewBox="0 0 24 24"
                    >
                      <path d="M12 20h9" />
                      <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z" />
                    </svg>
                  </div>
                  <div style={{ paddingRight: 20 }}>
                    <div className="q-title">Write Outreach</div>
                    <div className="q-desc">
                      Generate AI-personalized cold messages in seconds.
                    </div>
                  </div>
                  <div className="q-arrow">→</div>
                </a>
                <a className="q-card">
                  <div className="q-icon" style={{ background: "var(--amber-light)" }}>
                    <svg
                      fill="none"
                      stroke="#d97706"
                      strokeWidth="2"
                      viewBox="0 0 24 24"
                    >
                      <path d="M9 11l3 3L22 4" />
                      <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11" />
                    </svg>
                  </div>
                  <div style={{ paddingRight: 20 }}>
                    <div className="q-title">Track Pipeline</div>
                    <div className="q-desc">
                      Manage coffee chats, interviews, and offers in one board.
                    </div>
                  </div>
                  <div className="q-arrow">→</div>
                </a>
                <a className="q-card">
                  <div
                    className="q-icon"
                    style={{ background: "#fdf4ff" }}
                  >
                    <svg
                      fill="none"
                      stroke="#a855f7"
                      strokeWidth="2"
                      viewBox="0 0 24 24"
                    >
                      <rect x="2" y="7" width="20" height="14" rx="2" />
                      <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
                    </svg>
                  </div>
                  <div style={{ paddingRight: 20 }}>
                    <div className="q-title">Browse Jobs</div>
                    <div className="q-desc">
                      Live IB, PE, HF, and consulting roles updated daily.
                    </div>
                  </div>
                  <div className="q-arrow">→</div>
                </a>
              </div>
            </div>

            {/* Pipeline */}
            <div className="pipeline-card">
              <div className="card-header">
                <div className="card-title">Pipeline</div>
                <a className="card-link">Open tracker →</a>
              </div>
              <div className="filter-pills">
                <div className="fpill active">All</div>
                <div className="fpill">IB</div>
                <div className="fpill">PE</div>
                <div className="fpill">HF</div>
                <div className="fpill">Consulting</div>
              </div>
              <div className="pipeline-empty">
                <div className="empty-icon">
                  <svg
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.2"
                    viewBox="0 0 24 24"
                  >
                    <path d="M9 11l3 3L22 4" />
                    <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11" />
                  </svg>
                </div>
                <div className="empty-text">
                  No pipeline yet — start by finding contacts
                  <br />
                  or writing your first outreach message.
                </div>
                <a className="empty-btn">
                  <svg
                    width="11"
                    height="11"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.5"
                    viewBox="0 0 24 24"
                  >
                    <path d="M12 5v14" />
                    <path d="M5 12h14" />
                  </svg>
                  Build your first pipeline
                </a>
              </div>
            </div>

            {/* Recent contacts */}
            <div className="contacts-card">
              <div className="card-header">
                <div className="card-title">Recent Contacts</div>
                <a className="card-link">View all →</a>
              </div>
              <div className="ct-empty">
                <div className="empty-icon">
                  <svg
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.2"
                    viewBox="0 0 24 24"
                  >
                    <circle cx="11" cy="11" r="8" />
                    <path d="m21 21-4.35-4.35" />
                  </svg>
                </div>
                <div className="empty-text">
                  No contacts yet — import or search for your first one.
                </div>
                <a className="empty-btn">
                  <svg
                    width="11"
                    height="11"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.5"
                    viewBox="0 0 24 24"
                  >
                    <circle cx="11" cy="11" r="8" />
                    <path d="m21 21-4.35-4.35" />
                  </svg>
                  Search contacts
                </a>
              </div>
            </div>

            {/* Outreach performance */}
            <div className="perf-card">
              <div className="card-header">
                <div className="card-title">Outreach Performance</div>
                <a className="card-link">Write outreach →</a>
              </div>
              <div className="ct-empty" style={{ padding: "20px 16px" }}>
                <div className="empty-icon">
                  <svg
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.2"
                    viewBox="0 0 24 24"
                  >
                    <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
                  </svg>
                </div>
                <div className="empty-text">
                  No outreach yet — generate your first AI message
                  <br />
                  to see what templates are working.
                </div>
                <a className="empty-btn">Write outreach</a>
              </div>
            </div>
          </div>

          {/* Right column */}
          <div className="right-col">
            <div className="tip-card">
              <div className="tip-header">
                <div className="tip-dot" />
                <div className="tip-label">Recruiting Tip</div>
              </div>
              <div className="tip-text">
                &quot;Reference specific programs, clubs, or deals — vague emails
                get ignored. The more specific, the higher the reply rate.&quot;
              </div>
              <div className="tip-source">
                Based on Kynect reply-rate data · 2,400+ messages tracked
              </div>
            </div>

            <div className="rates-card">
              <div className="rates-header">
                <div className="card-title">Platform Reply Rates</div>
                <span className="pro-badge">Pro</span>
              </div>
              {[
                { label: "Alumni angle", pct: 68 },
                { label: "Shared interest", pct: 54 },
                { label: "Deal reference", pct: 41 },
                { label: "Mutual connection", pct: 37 },
                { label: "Generic intro", pct: 8 },
              ].map((item) => (
                <div key={item.label} className="rate-row">
                  <div className="rate-tag">{item.label}</div>
                  <div className="rate-bar-bg">
                    <div
                      className="rate-bar-inner"
                      style={{ width: `${item.pct}%` }}
                    />
                    <div className="rate-blur" />
                  </div>
                  <div className="rate-pct">—</div>
                </div>
              ))}
              <a className="unlock-link">Unlock with Pro →</a>
            </div>

            <div className="jobs-card">
              <div className="card-header">
                <div className="card-title">Live Job Listings</div>
                <a className="card-link">View all →</a>
              </div>
              {[
                {
                  title: "Summer Analyst — Investment Banking",
                  firm: "Goldman Sachs · New York",
                  deadline: "Due Jan 15",
                  type: "Internship",
                },
                {
                  title: "IB Summer Analyst",
                  firm: "J.P. Morgan · New York",
                  deadline: "Due Jan 22",
                  type: "Internship",
                },
                {
                  title: "Growth Equity Intern",
                  firm: "Insight Partners · New York",
                  deadline: "Due Feb 1",
                  type: "Internship",
                },
                {
                  title: "Investment Banking Analyst",
                  firm: "William Blair · Chicago",
                  deadline: "Due Feb 8",
                  type: "Full-time",
                },
              ].map((job) => (
                <div key={job.title} className="job-item">
                  <div className="job-role">{job.title}</div>
                  <div className="job-firm">{job.firm}</div>
                  <div className="job-footer">
                    <span className="job-deadline">{job.deadline}</span>
                    <span className="job-type">{job.type}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}


