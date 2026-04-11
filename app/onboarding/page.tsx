/* eslint-disable jsx-a11y/no-static-element-interactions */
"use client";

import { useEffect, useMemo, useState, useRef } from "react";
import { useMutation } from "convex/react";
import { useRouter } from "next/navigation";
import { api } from "../../convex/_generated/api";
import "./onboarding.css";

const SCHOOLS: string[] = ["Adelphi University", "American University", "Appalachian State University", "Arizona State University", "Auburn University", "Babson College", "Baruch College", "Baylor University", "Bentley University", "Binghamton University", "Boston College", "Boston University", "Bridgewater State University", "Brigham Young University", "Brown University", "Bryant University", "Bucknell University", "Carnegie Mellon University", "Case Western Reserve University", "Catholic University of America", "Champlain College", "Christopher Newport University", "Clark University", "Clemson University", "Colgate University", "Columbia University", "Cornell University", "Creighton University", "Dartmouth College", "DePaul University", "Dickinson College", "Drexel University", "Duke University", "East Carolina University", "Elizabethtown College", "Elon University", "Emerson College", "Emory University", "Fairfield University", "Fairleigh Dickinson University", "Fashion Institute of Technology", "Florida International University", "Florida State University", "Fordham University", "Franklin & Marshall College", "George Mason University", "George Washington University", "Georgetown University", "Georgia Institute of Technology", "Gettysburg College", "Hamilton College", "Harvard University", "High Point University", "Hofstra University", "Hobart and William Smith Colleges", "Howard University", "Indiana University", "Iona University", "Iowa State University", "Ithaca College", "James Madison University", "Johns Hopkins University", "Johnson & Wales University", "Kansas State University", "Kean University", "King's College PA", "La Selle University", "Lafayette College", "Lehigh University", "Liberty University", "Long Island University", "Longwood University", "Louisiana State University", "Loyola University Chicago", "Loyola University Maryland", "Manhattan College", "Marist College", "Marquette University", "Massachusetts Institute of Technology", "Merrimack College", "Miami University of Ohio", "Middlebury College", "Misericordia University", "Mississippi State University", "Monmouth University", "Montana State University", "Montclair State University", "Moravian University", "Muhlenberg College", "NC State University", "New York University", "Northeastern University", "Northwestern University", "Norwich University", "Ohio State University", "Ohio University", "Oklahoma State University", "Old Dominion University", "Oregon State University", "Pace University", "Penn State University", "Princeton University", "Providence College", "Purdue University", "Quinnipiac University", "Radford University", "Ramapo College", "Rensselaer Polytechnic Institute", "Rice University", "Rider University", "Rochester Institute of Technology", "Roger Williams University", "Rowan University", "Rutgers University", "Sacred Heart University", "Saint Anselm College", "Saint Francis University PA", "Saint Joseph's University", "Salve Regina University", "Seton Hall University", "Simmons University", "Skidmore College", "Slippery Rock University", "Southern Methodist University", "St. Lawrence University", "Stanford University", "Stockton University", "Stony Brook University", "Suffolk University", "Susquehanna University", "Syracuse University", "Temple University", "Texas A&M University", "Texas Christian University", "Texas Tech University", "The College of New Jersey", "The New School", "Towson University", "Tufts University", "Tulane University", "UMass Boston", "UMass Dartmouth", "UMass Lowell", "UNC Charlotte", "UCLA", "Union College", "University at Albany", "University at Buffalo", "University of Alabama", "University of Arizona", "University of Arkansas", "University of Baltimore", "University of California Berkeley", "University of Cincinnati", "University of Colorado Boulder", "University of Connecticut", "University of Central Florida", "University of Delaware", "University of Florida", "University of Georgia", "University of Houston", "University of Idaho", "University of Illinois Urbana-Champaign", "University of Iowa", "University of Kansas", "University of Kentucky", "University of Louisville", "University of Maryland", "University of Massachusetts Amherst", "University of Memphis", "University of Miami", "University of Michigan", "University of Minnesota", "University of Mississippi", "University of Missouri", "University of Montana", "University of Nebraska", "University of Nevada Las Vegas", "University of Nevada Reno", "University of New Hampshire", "University of New Mexico", "University of North Carolina at Chapel Hill", "University of North Texas", "University of Notre Dame", "University of Oklahoma", "University of Oregon", "University of Pennsylvania", "University of Pittsburgh", "University of Rhode Island", "University of Richmond", "University of Rochester", "University of South Carolina", "University of South Florida", "University of Southern California", "University of Tennessee", "University of Texas at Austin", "University of Tulsa", "University of Utah", "University of Vermont", "University of Virginia", "University of Washington", "University of Wisconsin Madison", "University of Wyoming", "Vanderbilt University", "Villanova University", "Virginia Commonwealth University", "Virginia Tech", "Wake Forest University", "Washington University in St. Louis", "Wheaton College MA", "Wichita State University", "Widener University", "Wilkes University", "William & Mary", "Worcester Polytechnic Institute", "Yale University"];
const VERTICALS: string[] = ["Investment Banking", "Private Equity", "Hedge Fund", "Venture Capital", "Growth Equity", "Sales & Trading", "Equity Research", "Asset Management", "Consulting", "Accounting / Audit / Tax", "Corporate Finance / FP&A", "Corporate Development", "Real Estate", "Credit / Debt", "Restructuring", "Family Office", "Endowment / Pension"];
const FIRMS: string[] = ["Goldman Sachs", "J.P. Morgan", "Morgan Stanley", "Evercore", "Lazard", "Centerview Partners", "PJT Partners", "Moelis", "Guggenheim Partners", "Houlihan Lokey", "William Blair", "Raymond James", "Jefferies", "RBC Capital Markets", "Barclays", "Citi", "Bank of America", "UBS", "Deutsche Bank", "Wells Fargo", "Macquarie", "Nomura", "Cowen", "Stifel", "Piper Sandler", "Canaccord Genuity", "Lincoln International", "Harris Williams", "Robert W. Baird", "Stephens Inc.", "Blackstone", "KKR", "Apollo Global Management", "Carlyle", "Ares Management", "TPG", "Thoma Bravo", "Vista Equity", "Advent International", "Hellman & Friedman", "Silver Lake", "General Atlantic", "Warburg Pincus", "EQT", "CVC Capital", "Cinven", "Permira", "Clayton Dubilier & Rice", "Insight Partners", "Tiger Global", "Two Sigma", "D.E. Shaw", "Citadel", "Citadel Securities", "Jane Street", "Hudson River Trading", "Virtu Financial", "Renaissance Technologies", "Jump Trading", "Point72", "Millennium Management", "AQR Capital", "Bridgewater Associates", "Man Group", "Winton Group", "McKinsey & Company", "Boston Consulting Group", "Bain & Company", "Deloitte", "EY", "PwC", "KPMG", "LEK", "Oliver Wyman", "Strategy&", "Accenture", "Alvarez & Marsal", "KeyBanc Capital Markets", "BMO Capital Markets", "HSBC", "BNP Paribas", "Societe Generale", "Credit Agricole", "Mizuho", "CIBC", "TD Securities", "Scotiabank", "Perella Weinberg Partners", "Qatalyst Partners", "Allen & Company", "LionTree", "Ducera Partners", "Greenhill", "Truist Securities", "Loop Capital Markets", "Bain Capital", "Brookfield Asset Management", "Cerberus Capital", "Leonard Green & Partners", "American Securities", "GTCR", "Madison Dearborn Partners", "Welsh Carson", "Francisco Partners", "Summit Partners", "TA Associates", "Audax Group", "Genstar Capital", "Platinum Equity", "Roark Capital", "Kohlberg & Company", "Sequoia Capital", "Andreessen Horowitz", "Bessemer Venture Partners", "Lightspeed Venture Partners", "Accel", "Greylock Partners", "Benchmark", "NEA", "GGV Capital", "Index Ventures", "Coatue Management", "Viking Global Investors", "Lone Pine Capital", "Tiger Global Management", "Pershing Square", "Elliott Management", "Third Point", "ValueAct Capital", "Baupost Group", "Appaloosa Management"];

type FormState = {
  firstName: string; lastName: string; university: string; major: string;
  year: string; targetRoles: string[]; recruitYear: string; targetFirms: string[]; email: string;
};

const PROFILE_STORAGE_KEY = "offerbell_onboarding_profile";

function SearchableDropdown({ items, value, onChange, placeholder, hasError }: {
  items: string[]; value: string; onChange: (val: string) => void; placeholder: string; hasError?: boolean;
}) {
  const [q, setQ] = useState("");
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const h = (e: MouseEvent) => { if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false); };
    document.addEventListener("mousedown", h); return () => document.removeEventListener("mousedown", h);
  }, []);
  const filtered = useMemo(() => {
    const t = q.trim().toLowerCase();
    return t ? items.filter((i) => i.toLowerCase().includes(t)).slice(0, 12) : items.slice(0, 8);
  }, [q, items]);
  return (
    <div ref={ref} className="searchable-dropdown">
      <div className={"sd-trigger" + (hasError ? " sd-error" : "")} onClick={() => setOpen(!open)}>
        <span className={value ? "sd-value" : "sd-placeholder"}>{value || placeholder}</span>
        <svg width="12" height="8" fill="none" viewBox="0 0 12 8"><path d="M1 1l5 5 5-5" stroke="#9e9b96" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
      </div>
      {open && (
        <div className="sd-menu">
          <input autoFocus className="sd-search" type="text" value={q} onChange={(e) => setQ(e.target.value)} placeholder="Type to search..." onClick={(e) => e.stopPropagation()} />
          <div className="sd-list">
            {filtered.length === 0 && <div className="sd-empty">No results found</div>}
            {filtered.map((item) => (
              <div key={item} className={"sd-item" + (item === value ? " sd-selected" : "")} onClick={() => { onChange(item); setOpen(false); setQ(""); }}>{item}</div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function MultiSearchDropdown({ items, selected, onToggle, placeholder, hasError }: {
  items: string[]; selected: string[]; onToggle: (val: string) => void; placeholder: string; hasError?: boolean;
}) {
  const [q, setQ] = useState("");
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const h = (e: MouseEvent) => { if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false); };
    document.addEventListener("mousedown", h); return () => document.removeEventListener("mousedown", h);
  }, []);
  const filtered = useMemo(() => {
    const t = q.trim().toLowerCase();
    return t ? items.filter((i) => i.toLowerCase().includes(t)).slice(0, 15) : items.slice(0, 12);
  }, [q, items]);
  const label = selected.length === 0 ? placeholder : selected.length === 1 ? selected[0] : selected.length + " selected";
  return (
    <div ref={ref} className="searchable-dropdown">
      <div className={"sd-trigger" + (hasError ? " sd-error" : "")} onClick={() => setOpen(!open)}>
        <span className={selected.length > 0 ? "sd-value" : "sd-placeholder"}>{label}</span>
        <svg width="12" height="8" fill="none" viewBox="0 0 12 8"><path d="M1 1l5 5 5-5" stroke="#9e9b96" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
      </div>
      {open && (
        <div className="sd-menu">
          <input autoFocus className="sd-search" type="text" value={q} onChange={(e) => setQ(e.target.value)} placeholder="Type to search..." onClick={(e) => e.stopPropagation()} />
          <div className="sd-list">
            {filtered.length === 0 && <div className="sd-empty">No results found</div>}
            {filtered.map((item) => {
              const active = selected.includes(item);
              return (
                <div key={item} className={"sd-item sd-check-item" + (active ? " sd-selected" : "")} onClick={(e) => { e.stopPropagation(); onToggle(item); }}>
                  <span className={"sd-checkbox" + (active ? " checked" : "")}>{active && "\u2713"}</span>{item}
                </div>
              );
            })}
          </div>
          {selected.length > 0 && (
            <div className="sd-selected-tags">
              {selected.map((s) => (<span key={s} className="sd-tag">{s}<span className="sd-tag-x" onClick={() => onToggle(s)}>&times;</span></span>))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default function OnboardingPage() {
  const router = useRouter();
  const updateProfile = useMutation((api as any).users?.updateProfile);
  const [currentStep, setCurrentStep] = useState<1 | 2 | 3 | 4>(1);
  const [selectedPlan, setSelectedPlan] = useState<"free" | "pro">("pro");
  const [promoCode, setPromoCode] = useState("");
  const [promoApplied, setPromoApplied] = useState(false);
  const [errors, setErrors] = useState<Record<string, boolean>>({});
  const [shakeStep, setShakeStep] = useState(false);
  const [form, setForm] = useState<FormState>({
    firstName: "", lastName: "", university: "", major: "", year: "",
    targetRoles: [], recruitYear: "", targetFirms: [], email: "",
  });

  const progressPercent = useMemo(() => (currentStep === 1 ? 25 : currentStep === 2 ? 50 : currentStep === 3 ? 75 : 100), [currentStep]);
  useEffect(() => { document.body.classList.add("onboarding-body"); return () => { document.body.classList.remove("onboarding-body"); }; }, []);

  useEffect(() => {
    if (typeof window === "undefined") return;
    try {
      const saved = window.localStorage.getItem(PROFILE_STORAGE_KEY);
      if (!saved) return;
      const parsed = JSON.parse(saved) as Partial<FormState>;
      setForm((prev) => ({
        ...prev,
        firstName: parsed.firstName ?? prev.firstName, lastName: parsed.lastName ?? prev.lastName,
        university: parsed.university ?? prev.university, major: parsed.major ?? prev.major,
        year: parsed.year ?? prev.year, email: parsed.email ?? prev.email,
        targetRoles: Array.isArray(parsed.targetRoles) ? parsed.targetRoles.filter((r): r is string => typeof r === "string") : prev.targetRoles,
        recruitYear: typeof parsed.recruitYear === "string" ? parsed.recruitYear : prev.recruitYear,
        targetFirms: Array.isArray(parsed.targetFirms) ? parsed.targetFirms.filter((f): f is string => typeof f === "string") : prev.targetFirms,
      }));
    } catch { /* ignore */ }
  }, []);

  const triggerShake = () => { setShakeStep(true); setTimeout(() => setShakeStep(false), 500); };

  const validateStep1 = (): boolean => {
    const errs: Record<string, boolean> = {};
    if (!form.firstName.trim()) errs.firstName = true;
    if (!form.lastName.trim()) errs.lastName = true;
    if (!form.university) errs.university = true;
    if (!form.major.trim()) errs.major = true;
    if (!form.year) errs.year = true;
    if (!form.email.trim() || !form.email.includes('@')) errs.email = true;
    setErrors(errs);
    if (Object.keys(errs).length > 0) { triggerShake(); return false; }
    return true;
  };
  const validateStep2 = (): boolean => {
    const errs: Record<string, boolean> = {};
    if (form.targetRoles.length === 0) errs.targetRoles = true;
    setErrors(errs);
    if (Object.keys(errs).length > 0) { triggerShake(); return false; }
    return true;
  };
  const validateStep3 = (): boolean => {
    const errs: Record<string, boolean> = {};
    if (form.targetFirms.length === 0) errs.targetFirms = true;
    setErrors(errs);
    if (Object.keys(errs).length > 0) { triggerShake(); return false; }
    return true;
  };

  const goNext = () => {
    if (currentStep === 1 && validateStep1()) setCurrentStep(2);
    else if (currentStep === 2 && validateStep2()) setCurrentStep(3);
    else if (currentStep === 3 && validateStep3()) setCurrentStep(4);
  };
  const goBack = () => { setErrors({}); if (currentStep === 2) setCurrentStep(1); else if (currentStep === 3) setCurrentStep(2); };

  const toggleRole = (role: string) => {
    setForm((p) => ({ ...p, targetRoles: p.targetRoles.includes(role) ? p.targetRoles.filter((r) => r !== role) : [...p.targetRoles, role] }));
    setErrors((e) => ({ ...e, targetRoles: false }));
  };
  const toggleFirm = (firm: string) => {
    setForm((p) => ({ ...p, targetFirms: p.targetFirms.includes(firm) ? p.targetFirms.filter((f) => f !== firm) : [...p.targetFirms, firm] }));
    setErrors((e) => ({ ...e, targetFirms: false }));
  };

  const handleFinish = async () => {
    if (!validateStep3()) return;
    try {
      const payload = { firstName: form.firstName, lastName: form.lastName, university: form.university, major: form.major, graduationYear: form.year, targetRoles: form.targetRoles, recruitYear: form.recruitYear, targetFirms: form.targetFirms };
      const result = await updateProfile(payload);
      if (typeof window !== "undefined") {
        const now = Date.now();
        const profileData: any = { firstName: form.firstName, lastName: form.lastName, university: form.university, major: form.major, year: form.year, targetRoles: form.targetRoles, recruitYear: form.recruitYear, targetFirms: form.targetFirms, email: form.email, plan: selectedPlan };
        if (promoApplied && promoCode.trim()) {
          profileData.promoCode = promoCode.trim();
          profileData.promoApplied = true;
          profileData.planActivatedAt = now;
          window.localStorage.setItem("offerbell_plan", "pro");
          window.localStorage.setItem("offerbell_plan_activated_at", String(now));
          window.localStorage.setItem("offerbell_promo_code", promoCode.trim());
        }
        window.localStorage.setItem(PROFILE_STORAGE_KEY, JSON.stringify(profileData));
      }
      const userId = (result && (result.userId ?? result.id ?? result)) ?? undefined;
      if (typeof window !== "undefined" && userId) {
        const id = String(userId);
        window.localStorage.setItem("offerbell_user_id", id);
        window.localStorage.setItem("userId", id);
        document.cookie = `offerbell_user_id=${encodeURIComponent(id)}; path=/; max-age=${60 * 60 * 24 * 30}`;
      }
      router.push(selectedPlan === "pro" && !promoApplied ? "/checkout" : "/dashboard");
    } catch (error) { console.error("Failed to update profile", error); }
  };

  return (
    <div className="page">
      <div className="left">
        <div className="left-logo">OfferBell<em>.</em></div>
        <div className="left-title">Let&apos;s set up your <em>profile</em></div>
        <div className="left-sub">Takes 2 minutes. We use this to personalize your outreach and surface the right contacts.</div>
        <div className="steps">
          <div className={`step-item ${currentStep === 1 ? "active" : currentStep > 1 ? "done" : ""}`}>
            <div className="step-dot">1</div><div className="step-content"><div className="step-label">About you</div><div className="step-desc">Name, school, major, year</div></div>
          </div>
          <div className={`step-item ${currentStep === 2 ? "active" : currentStep > 2 ? "done" : ""}`}>
            <div className="step-dot">2</div><div className="step-content"><div className="step-label">Career goals</div><div className="step-desc">Roles you&apos;re targeting</div></div>
          </div>
          <div className={`step-item ${currentStep === 3 ? "active" : currentStep > 3 ? "done" : ""}`}>
            <div className="step-dot">3</div><div className="step-content"><div className="step-label">Target firms</div><div className="step-desc">Dream companies and reach firms</div></div>
          </div>
          <div className={`step-item ${currentStep === 4 ? "active" : ""}`}>
            <div className="step-dot">4</div><div className="step-content"><div className="step-label">Choose your plan</div><div className="step-desc">Free or Pro</div></div>
          </div>
        </div>
      </div>
      <div className="right"><div className={"right-inner" + (currentStep === 4 ? " wide" : "")}>
        <div className="progress-bar"><div className="progress-fill" style={{ width: `${progressPercent}%` }} /></div>

        {currentStep === 1 && (
          <div className={"step-panel active" + (shakeStep ? " shake" : "")}>
            <div className="step-num">Step 1 of 4</div>
            <h2 className="step-heading">Tell us about <em>yourself</em></h2>
            <p className="step-subheading">This helps us personalize your outreach with the right context.</p>
            <div className="form-row">
              <div className="field">
                <label>First name <span className="req">*</span></label>
                <input type="text" placeholder="Alex" className={errors.firstName ? "input-error" : ""} value={form.firstName} onChange={(e) => { setForm((p) => ({ ...p, firstName: e.target.value })); setErrors((er) => ({ ...er, firstName: false })); }} />
                {errors.firstName && <span className="field-error">Required</span>}
              </div>
              <div className="field">
                <label>Last name <span className="req">*</span></label>
                <input type="text" placeholder="Chen" className={errors.lastName ? "input-error" : ""} value={form.lastName} onChange={(e) => { setForm((p) => ({ ...p, lastName: e.target.value })); setErrors((er) => ({ ...er, lastName: false })); }} />
                {errors.lastName && <span className="field-error">Required</span>}
              </div>
            </div>
            <div className="field">
              <label>University <span className="req">*</span></label>
              <SearchableDropdown items={SCHOOLS} value={form.university} onChange={(val) => { setForm((p) => ({ ...p, university: val })); setErrors((er) => ({ ...er, university: false })); }} placeholder="Search your university..." hasError={errors.university} />
              {errors.university && <span className="field-error">Required</span>}
            </div>
            <div className="form-row">
              <div className="field">
                <label>Major <span className="req">*</span></label>
                <input type="text" placeholder="e.g. Finance, Economics" className={errors.major ? "input-error" : ""} value={form.major} onChange={(e) => { setForm((p) => ({ ...p, major: e.target.value })); setErrors((er) => ({ ...er, major: false })); }} />
                {errors.major && <span className="field-error">Required</span>}
              </div>
              <div className="field">
                <label>Graduation year <span className="req">*</span></label>
                <select className={errors.year ? "input-error" : ""} value={form.year} onChange={(e) => { setForm((p) => ({ ...p, year: e.target.value })); setErrors((er) => ({ ...er, year: false })); }}>
                  <option value="">Select year</option><option>2025</option><option>2026</option><option>2027</option><option>2028</option><option>2029</option><option>2030</option>
                </select>
                {errors.year && <span className="field-error">Required</span>}
              </div>
            </div>
            <div className="field">
              <label>Email <span className="req">*</span></label>
              <input type="email" placeholder="you@school.edu" className={errors.email ? "input-error" : ""} value={form.email} onChange={(e) => { setForm((p) => ({ ...p, email: e.target.value })); setErrors((er) => ({ ...er, email: false })); }} />
              {errors.email && <span className="field-error">Required</span>}
            </div>

            <div className="step-nav">
              <button className="btn-back" disabled>&larr; Back</button>
              <button className="btn-next" onClick={goNext} type="button">Continue &rarr;</button>
            </div>
          </div>
        )}

        {currentStep === 2 && (
          <div className={"step-panel active" + (shakeStep ? " shake" : "")}>
            <div className="step-num">Step 2 of 4</div>
            <h2 className="step-heading">What roles are you <em>targeting?</em></h2>
            <p className="step-subheading">Select all that apply. We&apos;ll use this to tailor your outreach angles.</p>
            <div className="field">
              <label>Target roles <span className="req">*</span></label>
              <div className={"tag-grid" + (errors.targetRoles ? " tag-grid-error" : "")}>
                {VERTICALS.map((role) => {
                  const selected = form.targetRoles.includes(role);
                  return (<div key={role} className={`tag-option ${selected ? "selected" : ""}`} onClick={() => toggleRole(role)}>{role}</div>);
                })}
              </div>
              {errors.targetRoles && <span className="field-error">Select at least one role</span>}
            </div>
            <div className="step-nav">
              <button className="btn-back" onClick={goBack} type="button">&larr; Back</button>
              <button className="btn-next" onClick={goNext} type="button">Continue &rarr;</button>
            </div>
          </div>
        )}

        {currentStep === 3 && (
          <div className={"step-panel active" + (shakeStep ? " shake" : "")}>
            <div className="step-num">Step 3 of 4</div>
            <h2 className="step-heading">Which firms are you <em>targeting?</em></h2>
            <p className="step-subheading">Search and select your dream companies. We&apos;ll prioritize contacts there.</p>
            <div className="field">
              <label>Target firms <span className="req">*</span></label>
              <MultiSearchDropdown items={FIRMS} selected={form.targetFirms} onToggle={toggleFirm} placeholder="Search firms..." hasError={errors.targetFirms} />
              {form.targetFirms.length > 0 && (
                <div className="selected-firms">
                  {form.targetFirms.map((f) => (<span key={f} className="firm-chip">{f}<span className="firm-chip-x" onClick={() => toggleFirm(f)}>&times;</span></span>))}
                </div>
              )}
              {errors.targetFirms && <span className="field-error">Select at least one firm</span>}
            </div>
            <div className="step-nav">
              <button className="btn-back" onClick={goBack} type="button">&larr; Back</button>
              <button className="btn-next" onClick={goNext} type="button">Continue &rarr;</button>
            </div>
          </div>
        )}

                        {currentStep === 4 && (
          <div className={"step-panel active"}>
            <div className="step-num">Step 4 of 4</div>
            <h2 className="step-heading">Choose your <em>plan</em></h2>
            <p className="step-subheading">Pick what works for you. Upgrade or downgrade anytime.</p>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20, marginBottom: 20 }}>

              {/* FREE */}
              <div onClick={() => setSelectedPlan("free")} style={{
                border: selectedPlan === "free" ? "2.5px solid var(--black)" : "1.5px solid var(--gray-200)",
                borderRadius: 20, padding: "28px 26px 26px", cursor: "pointer",
                background: "var(--white)", transition: "all 0.18s", position: "relative",
                display: "flex", flexDirection: "column", minHeight: 420,
              }}>
                {selectedPlan === "free" && (
                  <div style={{ position: "absolute", top: 16, right: 16, width: 26, height: 26, borderRadius: "50%", background: "var(--black)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <svg width="13" height="13" fill="none" stroke="#fff" strokeWidth="2.5" viewBox="0 0 24 24"><polyline points="20 6 9 17 4 12"/></svg>
                  </div>
                )}
                <div style={{ fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: 1.5, color: "var(--gray-400)", marginBottom: 14 }}>Starter</div>
                <div style={{ fontFamily: "'Instrument Serif', serif", fontSize: 52, letterSpacing: "-1.5px", color: "var(--black)", lineHeight: 1 }}>$0<span style={{ fontSize: 18, fontFamily: "'DM Sans', sans-serif", color: "var(--gray-400)", fontWeight: 400 }}>/mo</span></div>
                <div style={{ fontSize: 13, color: "var(--gray-400)", marginTop: 6, marginBottom: 28 }}>No credit card required</div>
                <div style={{ height: 1, background: "var(--gray-100)", marginBottom: 24 }} />
                <div style={{ display: "flex", flexDirection: "column", gap: 16, fontSize: 13.5, flex: 1 }}>
                  {[
                    { on: true, text: "5 outreach messages / month" },
                    { on: false, text: "Resume Review" },
                    { on: true, text: "Outreach Tracker" },
                    { on: true, text: "Career Roadmaps Guide" },
                    { on: false, text: "AI Coach" },
                    { on: true, text: "Mentorship Program (Coming Soon)", badge: "SOON" },
                  ].map((item, i) => (
                    <div key={i} style={{ display: "flex", gap: 10, alignItems: "center" }}>
                      {item.on ? (
                        <svg width="18" height="18" fill="none" stroke="#16a34a" strokeWidth="2" viewBox="0 0 24 24" style={{ flexShrink: 0 }}><polyline points="20 6 9 17 4 12"/></svg>
                      ) : (
                        <svg width="18" height="18" fill="none" stroke="#d4d4d4" strokeWidth="1.5" viewBox="0 0 24 24" style={{ flexShrink: 0 }}><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
                      )}
                      <span style={{ color: item.on ? "var(--gray-600)" : "var(--gray-400)" }}>
                        {item.text}
                        {item.badge && <span style={{ fontSize: 9, fontWeight: 700, background: "#fef3c7", color: "#92400e", padding: "1px 5px", borderRadius: 3, marginLeft: 5, verticalAlign: "middle" }}>{item.badge}</span>}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* PRO */}
              <div onClick={() => setSelectedPlan("pro")} style={{
                border: selectedPlan === "pro" ? "2.5px solid var(--black)" : "1.5px solid var(--gray-200)",
                borderRadius: 20, padding: "28px 26px 26px", cursor: "pointer",
                background: selectedPlan === "pro" ? "var(--black)" : "var(--white)",
                transition: "all 0.18s", position: "relative",
                display: "flex", flexDirection: "column", minHeight: 420,
              }}>
                <div style={{ position: "absolute", top: 16, right: 16 }}>
                  {selectedPlan === "pro" ? (
                    <div style={{ width: 26, height: 26, borderRadius: "50%", background: "#fff", display: "flex", alignItems: "center", justifyContent: "center" }}>
                      <svg width="13" height="13" fill="none" stroke="var(--black)" strokeWidth="2.5" viewBox="0 0 24 24"><polyline points="20 6 9 17 4 12"/></svg>
                    </div>
                  ) : (
                    <span style={{ fontSize: 9, fontWeight: 700, background: "#fef3c7", color: "#92400e", padding: "3px 8px", borderRadius: 100, textTransform: "uppercase", letterSpacing: .5 }}>Popular</span>
                  )}
                </div>
                <div style={{ fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: 1.5, color: selectedPlan === "pro" ? "rgba(255,255,255,.35)" : "var(--gray-400)", marginBottom: 14 }}>Pro</div>
                <div style={{ fontFamily: "'Instrument Serif', serif", fontSize: 52, letterSpacing: "-1.5px", color: selectedPlan === "pro" ? "#fff" : "var(--black)", lineHeight: 1 }}>
                  {promoApplied ? "$0" : "$20"}<span style={{ fontSize: 18, fontFamily: "'DM Sans', sans-serif", color: selectedPlan === "pro" ? "rgba(255,255,255,.35)" : "var(--gray-400)", fontWeight: 400 }}>/mo</span>
                  {promoApplied && <span style={{ fontSize: 14, fontFamily: "'DM Sans', sans-serif", color: "#16a34a", fontWeight: 600, marginLeft: 8 }}>Code applied</span>}
                </div>
                <div style={{ fontSize: 13, color: selectedPlan === "pro" ? "rgba(255,255,255,.4)" : "var(--gray-400)", marginTop: 6, marginBottom: 28 }}>The unfair advantage in recruiting</div>
                <div style={{ height: 1, background: selectedPlan === "pro" ? "rgba(255,255,255,.08)" : "var(--gray-100)", marginBottom: 24 }} />
                <div style={{ display: "flex", flexDirection: "column", gap: 16, fontSize: 13.5, flex: 1 }}>
                  {[
                    { text: "Unlimited outreach messages", bold: true },
                    { text: "AI Resume Review with detailed feedback", bold: true },
                    { text: "AI Coach \u2014 personal recruiting advisor", bold: true },
                    { text: "Mentorship Program (Coming Soon)", bold: false },
                    { text: "Outreach Tracker", bold: false },
                    { text: "Career Roadmaps Guide", bold: false },
                    { text: "Interview Prep — all industries", bold: false },
                    { text: "Everything in Starter included", bold: false },
                  ].map((item, i) => (
                    <div key={i} style={{ display: "flex", gap: 10, alignItems: "center" }}>
                      <svg width="18" height="18" fill="none" stroke="#16a34a" strokeWidth="2" viewBox="0 0 24 24" style={{ flexShrink: 0 }}><polyline points="20 6 9 17 4 12"/></svg>
                      <span style={{ color: selectedPlan === "pro" ? (item.bold ? "#fff" : "rgba(255,255,255,.55)") : (item.bold ? "var(--black)" : "var(--gray-600)"), fontWeight: item.bold ? 600 : 400 }}>
                        {item.text}
                        {item.badge && <span style={{ fontSize: 9, fontWeight: 700, background: selectedPlan === "pro" ? "rgba(255,255,255,.12)" : "#dbeafe", color: selectedPlan === "pro" ? "rgba(255,255,255,.5)" : "#1d4ed8", padding: "1px 5px", borderRadius: 3, marginLeft: 5, verticalAlign: "middle" }}>{item.badge}</span>}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Promo Code */}
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 20, padding: "12px 16px", background: "var(--gray-50)", borderRadius: 12, border: "1px solid var(--gray-200)" }}>
              <svg width="16" height="16" fill="none" stroke="var(--gray-400)" strokeWidth="1.5" viewBox="0 0 24 24" style={{ flexShrink: 0 }}><path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z"/><line x1="7" y1="7" x2="7.01" y2="7"/></svg>
              <input
                type="text"
                placeholder="Have a promo code?"
                value={promoCode}
                onChange={(e) => { setPromoCode(e.target.value); setPromoApplied(false); }}
                style={{ flex: 1, border: "none", background: "transparent", fontSize: 13, fontFamily: "'DM Sans', sans-serif", color: "var(--black)", outline: "none" }}
              />
              <button
                type="button"
                onClick={() => {
                  if (promoCode.trim().length > 0) {
                    setPromoApplied(true);
                    setSelectedPlan("pro");
                  }
                }}
                style={{ padding: "6px 14px", borderRadius: 8, border: "1.5px solid var(--gray-200)", background: "var(--white)", fontSize: 12, fontWeight: 600, cursor: "pointer", fontFamily: "'DM Sans', sans-serif", color: "var(--black)" }}
              >
                Apply
              </button>
            </div>

            <div style={{ fontSize: 12, color: "var(--gray-400)", textAlign: "center", marginBottom: 16, lineHeight: 1.6 }}>
              {selectedPlan === "pro"
                ? (promoApplied ? "Promo code applied. You'll get Pro access at the discounted rate." : "You'll be taken to checkout after setup. Cancel anytime.")
                : "No credit card needed. Upgrade anytime from settings."}
            </div>

            <div className="step-nav">
              <button className="btn-back" onClick={goBack} type="button">&larr; Back</button>
              <button className="btn-next" onClick={handleFinish} type="button" style={{ background: "var(--black)", padding: "14px 40px" }}>
                {selectedPlan === "pro" ? "Continue to Checkout \u2192" : "Start Networking \u2192"}
              </button>
            </div>
          </div>
        )}

      </div></div>
    </div>
  );
}
