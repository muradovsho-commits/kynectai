"use client";

import { useState } from "react";
import { useMutation } from "convex/react";
import { useRouter } from "next/navigation";
import { api } from "../../convex/_generated/api";
import MobileGate from "../components/MobileGate";

function SignupContent() {
  const router = useRouter();
  const signUp = useMutation((api as any).auth?.signUp);

  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setError(null);
    if (password !== confirmPassword) { setError("Passwords do not match."); return; }

    try {
      setSubmitting(true);
      const result = await signUp({ fullName, email, password });
      
      const verificationToken = result?.verificationToken;
      
      if (verificationToken) {
        // Send verification email
        await fetch("/api/send-verification", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, token: verificationToken, name: fullName })
        });
      }

      // Flag that this is a new user who needs onboarding
      // NOTE: We do NOT set any localStorage here. The user must verify
      // their email first, then sign in. Only the signin flow creates
      // the session. This prevents orphaned keys from interfering with
      // subsequent logins.
      setSuccess(true);
    } catch (err: any) {
      const msg = err?.data ? String(err.data) : (err instanceof Error ? err.message : (err?.message || "Something went wrong."));
      if (msg.includes("already exists")) setError("An account with this email already exists. Please sign in instead.");
      else if (msg.includes("6 characters")) setError("Password must be at least 6 characters.");
      else setError(msg.replace("Uncaught Error: ", ""));
    } finally { setSubmitting(false); }
  };

  const inp: React.CSSProperties = {
    width: "100%", height: 48, padding: "0 16px",
    border: "1.5px solid #e4e2de", borderRadius: 10,
    fontSize: 14, fontFamily: "'Sora', sans-serif",
    color: "#0a0a0a", background: "#ffffff", outline: "none",
  };

  return (
    <div style={{ minHeight: "100vh", display: "flex", background: "#0a0a0a" }}>
      <div style={{ width: 480, position: 'relative', overflow: 'hidden', flexShrink: 0 }}>
        <img src="https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=960&h=1200&fit=crop&crop=faces" alt="" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', filter: 'brightness(0.3) saturate(0.8)' }} />
        <div style={{ position: 'relative', zIndex: 1, padding: "48px 44px", display: "flex", flexDirection: "column", justifyContent: "space-between", height: '100%' }}>
          <div>
            <div style={{ fontFamily: "'Instrument Serif', serif", fontSize: 24, letterSpacing: "-.5px", marginBottom: 64 }}><a href="/" style={{ color: "#fff", textDecoration: "none" }}>OfferBell<em style={{ fontStyle: "italic" }}>.</em></a></div>
            <div style={{ fontFamily: "'Instrument Serif', serif", fontSize: 42, lineHeight: 1.1, letterSpacing: "-1.2px", color: '#fff', marginBottom: 16 }}>Start your recruiting <em style={{ fontStyle: "italic" }}>journey.</em></div>
            <div style={{ fontSize: 14, color: "rgba(255,255,255,.55)", lineHeight: 1.7, maxWidth: 340, marginBottom: 36 }}>Join thousands of finance students using OfferBell to land offers at top firms.</div>
            <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
              {["AI-powered outreach that gets replies", "Track every networking conversation", "Interview prep for IB, PE, consulting & more", "Resume review, mock interviews, and coaching"].map((t, i) => (
                <div key={i} style={{ display: "flex", gap: 10, alignItems: "center", fontSize: 13, color: "rgba(255,255,255,.6)" }}>
                  <div style={{ width: 20, height: 20, borderRadius: 5, background: 'rgba(22,163,74,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    <svg width="12" height="12" fill="none" stroke="#22c55e" strokeWidth="2.5" viewBox="0 0 24 24"><polyline points="20 6 9 17 4 12"/></svg>
                  </div>
                  {t}
                </div>
              ))}
            </div>
          </div>
          <div>
            <div style={{ background: 'rgba(255,255,255,0.06)', backdropFilter: 'blur(8px)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 12, padding: '16px 18px', marginBottom: 20 }}>
              <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.7)', fontStyle: 'italic', lineHeight: 1.6, marginBottom: 8 }}>"OfferBell helped me go from confused to confident."</div>
              <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.35)', fontWeight: 600 }}>- Wharton '25</div>
            </div>
            <div style={{ fontSize: 12, color: "rgba(255,255,255,.25)" }}>officialofferbell@gmail.com</div>
          </div>
        </div>
      </div>

      <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", background: "#f8f8f7", padding: 40 }}>
        <div style={{ width: "100%", maxWidth: 420 }}>
          <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: 1.5, textTransform: "uppercase", color: "#9e9b96", marginBottom: 12 }}>Create Account</div>
          <div style={{ fontFamily: "'Instrument Serif', serif", fontSize: 30, letterSpacing: "-.5px", color: "#0a0a0a", marginBottom: 8 }}>
            {success ? "Check your inbox" : <>Let&apos;s get you <em style={{ fontStyle: "italic" }}>started</em></>}
          </div>
          <div style={{ fontSize: 14, color: "#6b6860", marginBottom: 36 }}>
            {success ? "We've sent a verification link to your email." : "Create your account in seconds. No credit card required."}
          </div>

          {success ? (
            <div style={{ background: "#ecfdf5", border: "1px solid #d1fae5", padding: 24, borderRadius: 12, textAlign: "center" }}>
              <div style={{ width: 48, height: 48, borderRadius: "50%", background: "#d1fae5", color: "#10b981", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 16px" }}>
                <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path></svg>
              </div>
              <div style={{ fontSize: 15, fontWeight: 600, color: "#065f46" }}>Verification email sent!</div>
              <div style={{ fontSize: 14, color: "#047857", marginTop: 8 }}>Please click the link in the email to verify your account before signing in.</div>
            </div>
          ) : (
          <form onSubmit={handleSubmit}>
            <div style={{ marginBottom: 16 }}>
              <label style={{ display: "block", fontSize: 13, fontWeight: 600, color: "#0a0a0a", marginBottom: 6 }}>Full name</label>
              <input type="text" placeholder="Alex Chen" value={fullName} onChange={(e) => setFullName(e.target.value)} required style={inp}
                onFocus={(e) => { e.currentTarget.style.borderColor = "#0a0a0a"; e.currentTarget.style.boxShadow = "0 0 0 3px rgba(10,10,10,0.06)"; }}
                onBlur={(e) => { e.currentTarget.style.borderColor = "#e4e2de"; e.currentTarget.style.boxShadow = "none"; }} />
            </div>
            <div style={{ marginBottom: 16 }}>
              <label style={{ display: "block", fontSize: 13, fontWeight: 600, color: "#0a0a0a", marginBottom: 6 }}>Email</label>
              <input type="email" placeholder="you@school.edu" value={email} onChange={(e) => setEmail(e.target.value)} required style={inp}
                onFocus={(e) => { e.currentTarget.style.borderColor = "#0a0a0a"; e.currentTarget.style.boxShadow = "0 0 0 3px rgba(10,10,10,0.06)"; }}
                onBlur={(e) => { e.currentTarget.style.borderColor = "#e4e2de"; e.currentTarget.style.boxShadow = "none"; }} />
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 24 }}>
              <div>
                <label style={{ display: "block", fontSize: 13, fontWeight: 600, color: "#0a0a0a", marginBottom: 6 }}>Password</label>
                <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required minLength={6} style={inp}
                  onFocus={(e) => { e.currentTarget.style.borderColor = "#0a0a0a"; e.currentTarget.style.boxShadow = "0 0 0 3px rgba(10,10,10,0.06)"; }}
                  onBlur={(e) => { e.currentTarget.style.borderColor = "#e4e2de"; e.currentTarget.style.boxShadow = "none"; }} />
              </div>
              <div>
                <label style={{ display: "block", fontSize: 13, fontWeight: 600, color: "#0a0a0a", marginBottom: 6 }}>Confirm</label>
                <input type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} required minLength={6} style={inp}
                  onFocus={(e) => { e.currentTarget.style.borderColor = "#0a0a0a"; e.currentTarget.style.boxShadow = "0 0 0 3px rgba(10,10,10,0.06)"; }}
                  onBlur={(e) => { e.currentTarget.style.borderColor = "#e4e2de"; e.currentTarget.style.boxShadow = "none"; }} />
              </div>
            </div>

            {error && (
              <div style={{ padding: "10px 14px", borderRadius: 8, background: "#fef2f2", border: "1px solid #fecaca", color: "#dc2626", fontSize: 13, fontWeight: 500, marginBottom: 18 }}>{error}</div>
            )}

            <button type="submit" disabled={submitting} style={{
              width: "100%", height: 48, borderRadius: 10, border: "none",
              background: "#0a0a0a", color: "#ffffff", fontSize: 14, fontWeight: 700,
              fontFamily: "'Sora', sans-serif", cursor: submitting ? "not-allowed" : "pointer",
              opacity: submitting ? 0.6 : 1, marginBottom: 14,
            }}>
              {submitting ? "Creating account..." : "Create Account"}
            </button>

            <div style={{ fontSize: 11.5, color: "#9e9b96", lineHeight: 1.55, textAlign: "center", marginBottom: 18 }}>
              By creating an account, you agree to our{" "}
              <a href="/terms.html" target="_blank" rel="noopener noreferrer" style={{ color: "#6b6860", textDecoration: "underline", textUnderlineOffset: 2 }}>Terms of Service</a>.
            </div>
          </form>
          )}

          <div style={{ textAlign: "center", fontSize: 13, color: "#6b6860" }}>
            Already have an account?{" "}
            <a href="/signin" style={{ color: "#0a0a0a", fontWeight: 700, textDecoration: "none" }}>Sign in</a>
          </div>
          <div style={{ textAlign: "center", marginTop: 12 }}>
            <a href="/" style={{ fontSize: 12, color: "#9e9b96", textDecoration: "none", fontWeight: 500 }}>
              ← Back to home
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function SignupPage() {
  return <MobileGate><SignupContent /></MobileGate>;
}
