"use client";

import Sidebar from "../components/Sidebar";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";
import "../dashboard/dashboard.css";
import "./profile.css";

type RoleOption =
  | "Investment Banking"
  | "Private Equity"
  | "Hedge Fund"
  | "Venture Capital"
  | "Growth Equity"
  | "Sales & Trading"
  | "Asset Management"
  | "Consulting"
  | "Corporate Finance"
  | "Equity Research"
  | "Real Estate"
  | "Credit / Debt";

type RecruitYearOption =
  | "Summer 2025"
  | "Summer 2026"
  | "Full-time 2025"
  | "Full-time 2026";

type ProfileState = {
  firstName: string;
  lastName: string;
  university: string;
  major: string;
  year: string;
  targetRoles: RoleOption[];
  recruitYear: RecruitYearOption | "";
  targetFirms: string[];
};

type SectionKey = "name" | "education" | "goals" | "firms";

const PROFILE_STORAGE_KEY = "offerbell_onboarding_profile";
const PLAN_STORAGE_KEYS = ["offerbell_plan", "plan", "user_plan"];

const ROLE_OPTIONS: RoleOption[] = [
  "Investment Banking",
  "Private Equity",
  "Hedge Fund",
  "Venture Capital",
  "Growth Equity",
  "Sales & Trading",
  "Asset Management",
  "Consulting",
  "Corporate Finance",
  "Equity Research",
  "Real Estate",
  "Credit / Debt",
];

const RECRUIT_YEAR_OPTIONS: RecruitYearOption[] = [
  "Summer 2025",
  "Summer 2026",
  "Full-time 2025",
  "Full-time 2026",
];

const POPULAR_FIRMS = [
  "Goldman Sachs",
  "J.P. Morgan",
  "Morgan Stanley",
  "Evercore",
  "Blackstone",
  "KKR",
  "Lazard",
  "Centerview Partners",
  "PJT Partners",
  "McKinsey",
];

const EMPTY_PROFILE: ProfileState = {
  firstName: "",
  lastName: "",
  university: "",
  major: "",
  year: "",
  targetRoles: [],
  recruitYear: "",
  targetFirms: [],
};

export default function ProfilePage() {
  const updateProfile = useMutation((api as any).users?.updateProfile);
  const [profile, setProfile] = useState<ProfileState>(EMPTY_PROFILE);
  const [draft, setDraft] = useState<ProfileState>(EMPTY_PROFILE);
  const [editing, setEditing] = useState<Record<SectionKey, boolean>>({
    name: false,
    education: false,
    goals: false,
    firms: false,
  });
  const [newFirm, setNewFirm] = useState("");
  const [loaded, setLoaded] = useState(false);
  const [savingSection, setSavingSection] = useState<SectionKey | null>(null);
  const [error, setError] = useState<string>("");
  const [currentPlan, setCurrentPlan] = useState("Free");

  useEffect(() => {
    const saved =
      typeof window !== "undefined"
        ? localStorage.getItem("offerbell-theme")
        : null;
    if (saved && typeof document !== "undefined") {
      document.documentElement.setAttribute("data-theme", saved);
    }
  }, []);

  const toggleTheme = () => {
    const html = document.documentElement;
    const next = html.getAttribute("data-theme") === "dark" ? "light" : "dark";
    html.setAttribute("data-theme", next);
    if (typeof window !== "undefined")
      localStorage.setItem("offerbell-theme", next);
  };

  const displayName = useMemo(() => {
    const full = `${profile.firstName} ${profile.lastName}`.trim();
    return full || "Your profile";
  }, [profile.firstName, profile.lastName]);

  const completion = useMemo(() => {
    const checks = [
      Boolean(profile.firstName.trim()),
      Boolean(profile.lastName.trim()),
      Boolean(profile.university.trim()),
      Boolean(profile.major.trim()),
      Boolean(profile.year.trim()),
      profile.targetRoles.length > 0,
      Boolean(profile.recruitYear),
      profile.targetFirms.length > 0,
    ];
    const done = checks.filter(Boolean).length;
    return Math.round((done / checks.length) * 100);
  }, [profile]);

  useEffect(() => {
    if (typeof window === "undefined") return;
    try {
      const planFromStorage = PLAN_STORAGE_KEYS.map((key) =>
        window.localStorage.getItem(key),
      ).find((value) => typeof value === "string" && value.trim().length > 0);
      if (planFromStorage) {
        const normalized = planFromStorage.trim().toLowerCase();
        setCurrentPlan(normalized.includes("pro") ? "Pro" : "Free");
      }

      const saved = window.localStorage.getItem(PROFILE_STORAGE_KEY);
      if (!saved) {
        setLoaded(true);
        return;
      }
      const parsed = JSON.parse(saved) as Partial<ProfileState>;
      const sanitized: ProfileState = {
        firstName: typeof parsed.firstName === "string" ? parsed.firstName : "",
        lastName: typeof parsed.lastName === "string" ? parsed.lastName : "",
        university:
          typeof parsed.university === "string" ? parsed.university : "",
        major: typeof parsed.major === "string" ? parsed.major : "",
        year: typeof parsed.year === "string" ? parsed.year : "",
        targetRoles: Array.isArray(parsed.targetRoles)
          ? parsed.targetRoles.filter((role): role is RoleOption =>
              ROLE_OPTIONS.includes(role as RoleOption),
            )
          : [],
        recruitYear:
          typeof parsed.recruitYear === "string" &&
          RECRUIT_YEAR_OPTIONS.includes(parsed.recruitYear as RecruitYearOption)
            ? (parsed.recruitYear as RecruitYearOption)
            : "",
        targetFirms: Array.isArray(parsed.targetFirms)
          ? parsed.targetFirms.filter(
              (firm): firm is string => typeof firm === "string",
            )
          : [],
      };
      setProfile(sanitized);
      setDraft(sanitized);
    } catch {
      setError("Could not read saved profile data.");
    } finally {
      setLoaded(true);
    }
  }, []);

  const startEdit = (section: SectionKey) => {
    setError("");
    setEditing((prev) => ({ ...prev, [section]: true }));
  };

  const cancelEdit = (section: SectionKey) => {
    setDraft(profile);
    setNewFirm("");
    setEditing((prev) => ({ ...prev, [section]: false }));
  };

  const persistProfile = async (next: ProfileState) => {
    if (typeof window !== "undefined") {
      window.localStorage.setItem(PROFILE_STORAGE_KEY, JSON.stringify(next));
    }
    await updateProfile({
      firstName: next.firstName,
      lastName: next.lastName,
      university: next.university,
      major: next.major,
      graduationYear: next.year,
      targetRoles: next.targetRoles,
      recruitYear: next.recruitYear,
      targetFirms: next.targetFirms,
    });
  };

  const saveSection = async (section: SectionKey) => {
    setSavingSection(section);
    setError("");

    const next: ProfileState = { ...profile };
    if (section === "name") {
      next.firstName = draft.firstName.trim();
      next.lastName = draft.lastName.trim();
    }
    if (section === "education") {
      next.university = draft.university.trim();
      next.major = draft.major.trim();
      next.year = draft.year;
    }
    if (section === "goals") {
      next.targetRoles = [...draft.targetRoles];
      next.recruitYear = draft.recruitYear;
    }
    if (section === "firms") {
      next.targetFirms = draft.targetFirms
        .map((firm) => firm.trim())
        .filter(Boolean);
    }

    try {
      await persistProfile(next);
      setProfile(next);
      setDraft(next);
      setNewFirm("");
      setEditing((prev) => ({ ...prev, [section]: false }));
    } catch {
      setError("Could not save your profile changes. Please try again.");
    } finally {
      setSavingSection(null);
    }
  };

  const toggleRole = (role: RoleOption) => {
    setDraft((prev) => {
      const exists = prev.targetRoles.includes(role);
      return {
        ...prev,
        targetRoles: exists
          ? prev.targetRoles.filter((current) => current !== role)
          : [...prev.targetRoles, role],
      };
    });
  };

  const addFirm = (firm: string) => {
    const cleaned = firm.trim();
    if (!cleaned) return;
    setDraft((prev) => {
      if (prev.targetFirms.includes(cleaned)) return prev;
      return { ...prev, targetFirms: [...prev.targetFirms, cleaned] };
    });
    setNewFirm("");
  };

  const removeFirm = (firm: string) => {
    setDraft((prev) => ({
      ...prev,
      targetFirms: prev.targetFirms.filter((item) => item !== firm),
    }));
  };

  if (!loaded) {
    return (
      <div className="app profile-app">
        <main className="main profile-main">
          <section className="profile-card">Loading profile...</section>
        </main>
      </div>
    );
  }

  return (
    <div className="app profile-app">
      <Sidebar activePage="profile" />

      <main className="main profile-main">
        <div className="topbar profile-topbar">
          <div>
            <div className="greeting">
              Profile settings for <em>{displayName}</em>
            </div>
            <div className="greeting-sub">
              Everything from onboarding in one place, with section-by-section
              editing.
            </div>
          </div>
          <div className="topbar-actions">
            <Link href="/dashboard" className="btn btn-ghost">
              Back to dashboard
            </Link>
          </div>
        </div>

        {error ? <div className="profile-alert">{error}</div> : null}

        <section className="profile-card profile-card-priority">
          <div className="profile-card-head">
            <div>
              <p className="profile-kicker">Profile completeness</p>
              <h2>{displayName}</h2>
              <p>
                Keep this updated to improve targeting quality and outreach
                recommendations.
              </p>
            </div>
            <div className="profile-score">
              <strong>{completion}%</strong>
              <span>Complete</span>
            </div>
          </div>
          <div className="profile-metrics">
            <div className="profile-metric">
              <span className="profile-metric-label">Roles</span>
              <span className="profile-metric-value">
                {profile.targetRoles.length}
              </span>
            </div>
            <div className="profile-metric">
              <span className="profile-metric-label">Firms</span>
              <span className="profile-metric-value">
                {profile.targetFirms.length}
              </span>
            </div>
            <div className="profile-metric">
              <span className="profile-metric-label">Recruiting Year</span>
              <span className="profile-metric-value">
                {profile.recruitYear || "-"}
              </span>
            </div>
            <div className="profile-metric">
              <span className="profile-metric-label">Current Plan</span>
              <span className="profile-metric-value">{currentPlan}</span>
            </div>
          </div>
        </section>

        <section className="profile-card">
          <div className="profile-card-head">
            <div>
              <h2>Plan</h2>
              <p>Your active subscription tier.</p>
            </div>
          </div>
          <div className="profile-line">Current plan: {currentPlan}</div>
        </section>

        <section className="profile-card">
          <div className="profile-card-head">
            <div>
              <h2>Name</h2>
              <p>First and last name from setup.</p>
            </div>
            {!editing.name ? (
              <button
                type="button"
                className="btn btn-ghost"
                onClick={() => startEdit("name")}
              >
                Edit
              </button>
            ) : null}
          </div>
          {!editing.name ? (
            <div className="profile-line">
              {`${profile.firstName || "-"} ${profile.lastName || ""}`.trim()}
            </div>
          ) : (
            <div className="profile-edit-grid two">
              <label>
                First name
                <input
                  value={draft.firstName}
                  onChange={(event) =>
                    setDraft((prev) => ({
                      ...prev,
                      firstName: event.target.value,
                    }))
                  }
                />
              </label>
              <label>
                Last name
                <input
                  value={draft.lastName}
                  onChange={(event) =>
                    setDraft((prev) => ({
                      ...prev,
                      lastName: event.target.value,
                    }))
                  }
                />
              </label>
              <div className="profile-actions-row">
                <button
                  type="button"
                  className="btn btn-dark"
                  disabled={savingSection === "name"}
                  onClick={() => void saveSection("name")}
                >
                  {savingSection === "name" ? "Saving..." : "Save"}
                </button>
                <button
                  type="button"
                  className="btn btn-ghost"
                  onClick={() => cancelEdit("name")}
                >
                  Cancel
                </button>
              </div>
            </div>
          )}
        </section>

        <section className="profile-card">
          <div className="profile-card-head">
            <div>
              <h2>Education</h2>
              <p>School, major, and graduation year.</p>
            </div>
            {!editing.education ? (
              <button
                type="button"
                className="btn btn-ghost"
                onClick={() => startEdit("education")}
              >
                Edit
              </button>
            ) : null}
          </div>
          {!editing.education ? (
            <div className="profile-stack">
              <div className="profile-line">
                School: {profile.university || "-"}
              </div>
              <div className="profile-line">Major: {profile.major || "-"}</div>
              <div className="profile-line">
                Grad year: {profile.year || "-"}
              </div>
            </div>
          ) : (
            <div className="profile-edit-grid two">
              <label>
                University
                <input
                  value={draft.university}
                  onChange={(event) =>
                    setDraft((prev) => ({
                      ...prev,
                      university: event.target.value,
                    }))
                  }
                />
              </label>
              <label>
                Major
                <input
                  value={draft.major}
                  onChange={(event) =>
                    setDraft((prev) => ({ ...prev, major: event.target.value }))
                  }
                />
              </label>
              <label>
                Graduation year
                <select
                  value={draft.year}
                  onChange={(event) =>
                    setDraft((prev) => ({ ...prev, year: event.target.value }))
                  }
                >
                  <option value="">Select year</option>
                  <option value="2025">2025</option>
                  <option value="2026">2026</option>
                  <option value="2027">2027</option>
                  <option value="2028">2028</option>
                  <option value="2029">2029</option>
                </select>
              </label>
              <div className="profile-actions-row">
                <button
                  type="button"
                  className="btn btn-dark"
                  disabled={savingSection === "education"}
                  onClick={() => void saveSection("education")}
                >
                  {savingSection === "education" ? "Saving..." : "Save"}
                </button>
                <button
                  type="button"
                  className="btn btn-ghost"
                  onClick={() => cancelEdit("education")}
                >
                  Cancel
                </button>
              </div>
            </div>
          )}
        </section>

        <section className="profile-card">
          <div className="profile-card-head">
            <div>
              <h2>Recruiting Targets</h2>
              <p>Roles and recruiting year you selected.</p>
            </div>
            {!editing.goals ? (
              <button
                type="button"
                className="btn btn-ghost"
                onClick={() => startEdit("goals")}
              >
                Edit
              </button>
            ) : null}
          </div>
          {!editing.goals ? (
            <div className="profile-stack">
              <div className="chip-list">
                {profile.targetRoles.length > 0 ? (
                  profile.targetRoles.map((role) => (
                    <span key={role} className="chip">
                      {role}
                    </span>
                  ))
                ) : (
                  <div className="profile-line">No target roles selected.</div>
                )}
              </div>
              <div className="profile-line">
                Recruiting for: {profile.recruitYear || "-"}
              </div>
            </div>
          ) : (
            <div className="profile-edit-grid">
              <div>
                <p className="profile-field-label">Target roles</p>
                <div className="chip-list">
                  {ROLE_OPTIONS.map((role) => {
                    const selected = draft.targetRoles.includes(role);
                    return (
                      <button
                        key={role}
                        type="button"
                        className={`chip-toggle ${selected ? "selected" : ""}`}
                        onClick={() => toggleRole(role)}
                      >
                        {role}
                      </button>
                    );
                  })}
                </div>
              </div>
              <div>
                <p className="profile-field-label">Recruiting year</p>
                <div className="chip-list">
                  {RECRUIT_YEAR_OPTIONS.map((option) => {
                    const selected = draft.recruitYear === option;
                    return (
                      <button
                        key={option}
                        type="button"
                        className={`chip-toggle ${selected ? "selected" : ""}`}
                        onClick={() =>
                          setDraft((prev) => ({ ...prev, recruitYear: option }))
                        }
                      >
                        {option}
                      </button>
                    );
                  })}
                </div>
              </div>
              <div className="profile-actions-row">
                <button
                  type="button"
                  className="btn btn-dark"
                  disabled={savingSection === "goals"}
                  onClick={() => void saveSection("goals")}
                >
                  {savingSection === "goals" ? "Saving..." : "Save"}
                </button>
                <button
                  type="button"
                  className="btn btn-ghost"
                  onClick={() => cancelEdit("goals")}
                >
                  Cancel
                </button>
              </div>
            </div>
          )}
        </section>

        <section className="profile-card">
          <div className="profile-card-head">
            <div>
              <h2>Target Firms</h2>
              <p>Companies you want to network with.</p>
            </div>
            {!editing.firms ? (
              <button
                type="button"
                className="btn btn-ghost"
                onClick={() => startEdit("firms")}
              >
                Edit
              </button>
            ) : null}
          </div>
          {!editing.firms ? (
            <div className="chip-list">
              {profile.targetFirms.length > 0 ? (
                profile.targetFirms.map((firm) => (
                  <span key={firm} className="chip">
                    {firm}
                  </span>
                ))
              ) : (
                <div className="profile-line">No firms added yet.</div>
              )}
            </div>
          ) : (
            <div className="profile-edit-grid">
              <div className="profile-input-row">
                <input
                  value={newFirm}
                  onChange={(event) => setNewFirm(event.target.value)}
                  placeholder="Add a firm"
                  onKeyDown={(event) => {
                    if (event.key === "Enter") {
                      event.preventDefault();
                      addFirm(newFirm);
                    }
                  }}
                />
                <button
                  type="button"
                  className="btn btn-ghost"
                  onClick={() => addFirm(newFirm)}
                >
                  Add
                </button>
              </div>

              <div className="chip-list">
                {draft.targetFirms.map((firm) => (
                  <button
                    key={firm}
                    type="button"
                    className="chip-remove"
                    onClick={() => removeFirm(firm)}
                  >
                    {firm} ×
                  </button>
                ))}
              </div>

              <div>
                <p className="profile-field-label">Popular firms</p>
                <div className="chip-list">
                  {POPULAR_FIRMS.map((firm) => (
                    <button
                      key={firm}
                      type="button"
                      className="chip-toggle"
                      onClick={() => addFirm(firm)}
                    >
                      {firm}
                    </button>
                  ))}
                </div>
              </div>

              <div className="profile-actions-row">
                <button
                  type="button"
                  className="btn btn-dark"
                  disabled={savingSection === "firms"}
                  onClick={() => void saveSection("firms")}
                >
                  {savingSection === "firms" ? "Saving..." : "Save"}
                </button>
                <button
                  type="button"
                  className="btn btn-ghost"
                  onClick={() => cancelEdit("firms")}
                >
                  Cancel
                </button>
              </div>
            </div>
          )}
        </section>
      </main>
    </div>
  );
}
