/* eslint-disable jsx-a11y/no-static-element-interactions */
"use client";

import { useEffect, useMemo, useState } from "react";
import { useMutation } from "convex/react";
import { useRouter } from "next/navigation";
import { api } from "../../convex/_generated/api";
import "./onboarding.css";

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

type FormState = {
  firstName: string;
  lastName: string;
  university: string;
  major: string;
  year: string;
  targetRoles: RoleOption[];
  recruitYear: RecruitYearOption | "";
  targetFirms: string[];
};

const FIRM_SUGGESTIONS = [
  "Goldman Sachs",
  "J.P. Morgan",
  "Morgan Stanley",
  "Evercore",
  "Lazard",
  "Centerview Partners",
  "PJT Partners",
  "Blackstone",
  "KKR",
  "Apollo",
  "Carlyle",
  "Bain Capital",
  "TPG",
  "Warburg Pincus",
  "Insight Partners",
  "Sequoia",
  "a16z",
  "General Atlantic",
  "William Blair",
  "Jefferies",
  "Houlihan Lokey",
  "Rothschild",
  "Moelis",
  "Guggenheim",
  "Piper Sandler",
  "McKinsey",
  "BCG",
  "Bain",
  "Oliver Wyman",
  "Deloitte",
  "Bridgewater",
  "Citadel",
  "Two Sigma",
  "D.E. Shaw",
  "Point72",
];

export default function OnboardingPage() {
  const router = useRouter();
  const updateProfile = useMutation((api as any).users?.updateProfile);

  const [currentStep, setCurrentStep] = useState<1 | 2 | 3>(1);
  const [form, setForm] = useState<FormState>({
    firstName: "",
    lastName: "",
    university: "",
    major: "",
    year: "",
    targetRoles: [],
    recruitYear: "",
    targetFirms: [],
  });
  const [companies, setCompanies] = useState<string[]>([]);
  const [companyInput, setCompanyInput] = useState("");
  const [showSuggestions, setShowSuggestions] = useState(false);

  const progressPercent = useMemo(
    () => (currentStep === 1 ? 33 : currentStep === 2 ? 66 : 100),
    [currentStep],
  );

  useEffect(() => {
    document.body.classList.add("onboarding-body");
    return () => {
      document.body.classList.remove("onboarding-body");
    };
  }, []);

  useEffect(() => {
    const handleClick = (event: MouseEvent) => {
      const target = event.target as HTMLElement | null;
      if (!target?.closest(".company-input-wrap")) {
        setShowSuggestions(false);
      }
    };
    document.addEventListener("click", handleClick);
    return () => document.removeEventListener("click", handleClick);
  }, []);

  const goToStep = (step: 1 | 2 | 3) => {
    setCurrentStep(step);
  };

  const toggleRole = (role: RoleOption) => {
    setForm((prev) => {
      const exists = prev.targetRoles.includes(role);
      return {
        ...prev,
        targetRoles: exists
          ? prev.targetRoles.filter((r) => r !== role)
          : [...prev.targetRoles, role],
      };
    });
  };

  const setRecruitYear = (value: RecruitYearOption) => {
    setForm((prev) => ({ ...prev, recruitYear: value }));
  };

  const addCompany = (name: string) => {
    setCompanies((prev) =>
      prev.includes(name) ? prev : [...prev, name],
    );
    setForm((prev) =>
      prev.targetFirms.includes(name)
        ? prev
        : { ...prev, targetFirms: [...prev.targetFirms, name] },
    );
    setCompanyInput("");
    setShowSuggestions(false);
  };

  const removeCompany = (index: number) => {
    setCompanies((prev) => prev.filter((_, i) => i !== index));
    setForm((prev) => ({
      ...prev,
      targetFirms: prev.targetFirms.filter((_, i) => i !== index),
    }));
  };

  const handleCompanyKeyDown = (
    event: React.KeyboardEvent<HTMLInputElement>,
  ) => {
    if (event.key === "Enter") {
      event.preventDefault();
      const val = companyInput.trim();
      if (val) addCompany(val);
    }
  };

  const filteredSuggestions = useMemo(() => {
    const val = companyInput.trim().toLowerCase();
    if (!val) return [];
    return FIRM_SUGGESTIONS.filter((f) =>
      f.toLowerCase().includes(val),
    ).slice(0, 5);
  }, [companyInput]);

  useEffect(() => {
    setShowSuggestions(filteredSuggestions.length > 0);
  }, [filteredSuggestions.length]);

  const handleFinish = async () => {
    try {
      const result = await updateProfile({
        firstName: form.firstName,
        lastName: form.lastName,
        university: form.university,
        major: form.major,
        graduationYear: form.year,
        targetRoles: form.targetRoles,
        recruitYear: form.recruitYear,
        targetFirms: form.targetFirms,
      });

      const userId =
        (result && (result.userId ?? result.id ?? result)) ?? undefined;

      if (typeof window !== "undefined" && userId) {
        const id = String(userId);
        window.localStorage.setItem("kynect_user_id", id);
        window.localStorage.setItem("userId", id);
        document.cookie = `kynect_user_id=${encodeURIComponent(
          id,
        )}; path=/; max-age=${60 * 60 * 24 * 30}`;
      }

      router.push("/dashboard");
    } catch (error) {
      console.error("Failed to update profile", error);
    }
  };

  return (
    <div className="page">
      <div className="left">
        <div className="left-logo">
          Kynect<em>.</em>
        </div>
        <div className="left-title">
          Let&apos;s set up your <em>profile</em>
        </div>
        <div className="left-sub">
          Takes 2 minutes. We use this to personalize your outreach and surface
          the right contacts.
        </div>

        <div className="steps">
          <div
            className={`step-item ${
              currentStep === 1 ? "active" : currentStep > 1 ? "done" : ""
            }`}
            id="side-step-1"
          >
            <div className="step-dot">1</div>
            <div className="step-content">
              <div className="step-label">About you</div>
              <div className="step-desc">Name, school, major, year</div>
            </div>
          </div>
          <div
            className={`step-item ${
              currentStep === 2 ? "active" : currentStep > 2 ? "done" : ""
            }`}
            id="side-step-2"
          >
            <div className="step-dot">2</div>
            <div className="step-content">
              <div className="step-label">Career goals</div>
              <div className="step-desc">
                Roles and industries you&apos;re targeting
              </div>
            </div>
          </div>
          <div
            className={`step-item ${
              currentStep === 3 ? "active" : ""
            }`}
            id="side-step-3"
          >
            <div className="step-dot">3</div>
            <div className="step-content">
              <div className="step-label">Target firms</div>
              <div className="step-desc">
                Dream companies and reach firms
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="right">
        <div className="right-inner">
          <div className="progress-bar">
            <div
              className="progress-fill"
              id="progress"
              style={{ width: `${progressPercent}%` }}
            />
          </div>

          {currentStep === 1 && (
            <div className="step-panel active" id="panel-1">
              <div className="step-num">Step 1 of 3</div>
              <h2 className="step-heading">
                Tell us about <em>yourself</em>
              </h2>
              <p className="step-subheading">
                This helps us personalize your outreach with the right context.
              </p>

              <div className="form-row">
                <div className="field">
                  <label>First name</label>
                  <input
                    type="text"
                    id="firstName"
                    placeholder="Alex"
                    value={form.firstName}
                    onChange={(e) =>
                      setForm((prev) => ({
                        ...prev,
                        firstName: e.target.value,
                      }))
                    }
                  />
                </div>
                <div className="field">
                  <label>Last name</label>
                  <input
                    type="text"
                    id="lastName"
                    placeholder="Chen"
                    value={form.lastName}
                    onChange={(e) =>
                      setForm((prev) => ({
                        ...prev,
                        lastName: e.target.value,
                      }))
                    }
                  />
                </div>
              </div>

              <div className="field">
                <label>University</label>
                <input
                  type="text"
                  id="university"
                  placeholder="e.g. NYU Stern, Wharton, Michigan Ross"
                  value={form.university}
                  onChange={(e) =>
                    setForm((prev) => ({
                      ...prev,
                      university: e.target.value,
                    }))
                  }
                />
              </div>

              <div className="form-row">
                <div className="field">
                  <label>Major</label>
                  <input
                    type="text"
                    id="major"
                    placeholder="e.g. Finance, Economics"
                    value={form.major}
                    onChange={(e) =>
                      setForm((prev) => ({
                        ...prev,
                        major: e.target.value,
                      }))
                    }
                  />
                </div>
                <div className="field">
                  <label>Graduation year</label>
                  <select
                    id="year"
                    value={form.year}
                    onChange={(e) =>
                      setForm((prev) => ({
                        ...prev,
                        year: e.target.value,
                      }))
                    }
                  >
                    <option value="">Select year</option>
                    <option>2025</option>
                    <option>2026</option>
                    <option>2027</option>
                    <option>2028</option>
                    <option>2029</option>
                  </select>
                </div>
              </div>

              <div className="step-nav">
                <button className="btn-back" disabled>
                  ← Back
                </button>
                <button
                  className="btn-next"
                  onClick={() => goToStep(2)}
                  type="button"
                >
                  Continue →
                </button>
              </div>
            </div>
          )}

          {currentStep === 2 && (
            <div className="step-panel active" id="panel-2">
              <div className="step-num">Step 2 of 3</div>
              <h2 className="step-heading">
                What roles are you <em>targeting?</em>
              </h2>
              <p className="step-subheading">
                Select all that apply. We&apos;ll use this to tailor your
                outreach angles.
              </p>

              <div className="field">
                <label>Target roles</label>
                <div className="tag-grid" id="role-tags">
                  {[
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
                  ].map((role) => {
                    const typed = role as RoleOption;
                    const selected = form.targetRoles.includes(typed);
                    return (
                      <div
                        key={role}
                        className={`tag-option ${
                          selected ? "selected" : ""
                        }`}
                        onClick={() => toggleRole(typed)}
                      >
                        {role}
                      </div>
                    );
                  })}
                </div>
              </div>

              <div className="field" style={{ marginTop: 32 }}>
                <label>What year are you recruiting for?</label>
                <div className="tag-grid">
                  {[
                    "Summer 2025",
                    "Summer 2026",
                    "Full-time 2025",
                    "Full-time 2026",
                  ].map((label) => {
                    const typed = label as RecruitYearOption;
                    const selected = form.recruitYear === typed;
                    return (
                      <div
                        key={label}
                        className={`tag-option ${
                          selected ? "selected" : ""
                        }`}
                        onClick={() => setRecruitYear(typed)}
                      >
                        {label}
                      </div>
                    );
                  })}
                </div>
              </div>

              <div className="step-nav">
                <button
                  className="btn-back"
                  onClick={() => goToStep(1)}
                  type="button"
                >
                  ← Back
                </button>
                <button
                  className="btn-next"
                  onClick={() => goToStep(3)}
                  type="button"
                >
                  Continue →
                </button>
              </div>
            </div>
          )}

          {currentStep === 3 && (
            <div className="step-panel active" id="panel-3">
              <div className="step-num">Step 3 of 3</div>
              <h2 className="step-heading">
                Which firms are you <em>targeting?</em>
              </h2>
              <p className="step-subheading">
                Add your dream companies. We&apos;ll prioritize contacts there.
              </p>

              <div className="field">
                <label>Target firms</label>
                <div className="company-tags" id="company-tags">
                  {companies.map((c, i) => (
                    <div key={`${c}-${i}`} className="company-tag">
                      {c}
                      <span
                        className="company-tag-remove"
                        onClick={() => removeCompany(i)}
                      >
                        ×
                      </span>
                    </div>
                  ))}
                </div>
                <div className="company-input-wrap">
                  <input
                    type="text"
                    id="company-input"
                    placeholder="Type a firm name and press Enter..."
                    onKeyDown={handleCompanyKeyDown}
                    onInput={(e) =>
                      setCompanyInput(
                        (e.target as HTMLInputElement).value,
                      )
                    }
                    autoComplete="off"
                    value={companyInput}
                    onChange={(e) => setCompanyInput(e.target.value)}
                  />
                  <div
                    className={`company-suggestions ${
                      showSuggestions ? "show" : ""
                    }`}
                    id="suggestions"
                  >
                    {filteredSuggestions.map((m) => (
                      <div
                        key={m}
                        className="suggestion-item"
                        onClick={() => addCompany(m)}
                      >
                        {m}
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="field" style={{ marginTop: 8 }}>
                <label
                  style={{
                    color: "var(--gray-400)",
                    fontWeight: 400,
                    fontSize: 12,
                  }}
                >
                  Popular firms
                </label>
                <div className="tag-grid" style={{ marginTop: 8 }}>
                  {[
                    "Goldman Sachs",
                    "J.P. Morgan",
                    "Morgan Stanley",
                    "Evercore",
                    "Blackstone",
                    "KKR",
                    "McKinsey",
                    "Lazard",
                    "Centerview",
                    "PJT Partners",
                  ].map((firm) => (
                    <div
                      key={firm}
                      className="tag-option"
                      style={{ fontSize: 12, padding: "6px 12px" }}
                      onClick={() => addCompany(firm)}
                    >
                      {firm}
                    </div>
                  ))}
                </div>
              </div>

              <div className="step-nav">
                <button
                  className="btn-back"
                  onClick={() => goToStep(2)}
                  type="button"
                >
                  ← Back
                </button>
                <button
                  className="btn-next"
                  onClick={handleFinish}
                  type="button"
                  style={{
                    background: "var(--black)",
                    padding: "14px 40px",
                  }}
                >
                  Start Networking →
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}


