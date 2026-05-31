"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import MobileGate from "../components/MobileGate";

function SignupContent() {
  const router = useRouter();

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
    if (password.length < 8) { setError("Password must be at least 8 characters."); return; }

    try {
      setSubmitting(true);
      // Server-side signup: rate-limited per IP, password hashed by Convex,
      // signed HttpOnly session cookie issued on success.
      const res = await fetch("/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ fullName, email, password }),
      });
      const result = await res.json();
      if (!res.ok) {
        throw new Error(result?.error || "Signup failed.");
      }

      const verificationToken = result?.verificationToken;

      if (verificationToken) {
        // Send verification email
        await fetch("/api/send-verification", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, token: verificationToken, name: fullName })
        });
      }

      // No localStorage writes here. User must verify their email, then sign
      // in - that flow establishes the local state.
      setSuccess(true);
    } catch (err: any) {
      const msg = err?.message || "Something went wrong.";
      if (/already exists|already/i.test(msg)) setError("An account with this email already exists. Please sign in instead.");
      else if (/8 characters|6 characters/i.test(msg)) setError("Password must be at least 8 characters.");
      else setError(msg.replace("Uncaught Error: ", ""));
    } finally { setSubmitting(false); }
  };

  // ════════════════════════════════════════════════════════════════════════
  // NEW DESIGN — Single-column, centered, mirrors signin for consistency.
  // ════════════════════════════════════════════════════════════════════════

  const inputStyle: React.CSSProperties = {
    width: "100%",
    height: 48,
    padding: "0 16px",
    border: "1.5px solid #e6e3dc",
    borderRadius: 10,
    fontSize: 14,
    fontFamily: "'Sora', sans-serif",
    color: "#0f0f0f",
    background: "#ffffff",
    outline: "none",
    transition: "border-color 0.15s, box-shadow 0.15s",
  };

  return (
    <div style={{
      minHeight: "100vh",
      background: "#fafafa",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      fontFamily: "'Sora', -apple-system, BlinkMacSystemFont, sans-serif",
      color: "#0f0f0f",
      padding: "40px 24px 60px",
    }}>
      <a href="/" style={{
        fontFamily: "'Instrument Serif', 'Times New Roman', serif",
        fontSize: 28, letterSpacing: "-0.6px",
        color: "#0f0f0f", textDecoration: "none",
        marginBottom: 48, display: "inline-flex", alignItems: "baseline",
      }}>
        OfferBell<em style={{ fontStyle: "italic", color: "#0f0f0f" }}>.</em>
      </a>

      <div style={{ width: "100%", maxWidth: 420 }}>
        <div style={{
          fontSize: 11, fontWeight: 700, letterSpacing: 1.6, textTransform: "uppercase",
          color: "#9a9a9a", marginBottom: 14,
        }}>{success ? "Almost There" : "Create Account"}</div>

        <h1 style={{
          fontFamily: "'Instrument Serif', 'Times New Roman', serif",
          fontSize: 48, fontWeight: 400, letterSpacing: "-1.2px", lineHeight: 1.05,
          margin: "0 0 14px 0",
        }}>
          {success ? (
            <>Check your <em style={{ fontStyle: "italic" }}>inbox</em>.</>
          ) : (
            <>Start your <em style={{ fontStyle: "italic" }}>journey</em>.</>
          )}
        </h1>

        <p style={{ fontSize: 14, color: "#5c5c5c", lineHeight: 1.6, margin: "0 0 36px 0" }}>
          {success
            ? "We've sent a verification link to your email. Click it to activate your account, then come back to sign in."
            : "Free to start. No credit card required."}
        </p>

        {success ? (
          // ── SUCCESS STATE: subtle card with mail icon + helpful next steps ──
          <div style={{
            padding: "26px 22px", borderRadius: 12,
            background: "#ffffff", border: "1px solid #e6e3dc",
            textAlign: "center",
          }}>
            <div style={{
              width: 52, height: 52, borderRadius: "50%",
              background: "#f5f3ec", color: "#0f0f0f",
              display: "flex", alignItems: "center", justifyContent: "center",
              margin: "0 auto 18px",
            }}>
              <svg width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
                <rect x="2" y="4" width="20" height="16" rx="2"/>
                <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/>
              </svg>
            </div>
            <div style={{ fontSize: 15, fontWeight: 700, color: "#0f0f0f", marginBottom: 8 }}>
              Verification email sent
            </div>
            <div style={{ fontSize: 13.5, color: "#5c5c5c", lineHeight: 1.6, marginBottom: 18 }}>
              Click the link in the email to verify your account, then sign in to get started.
            </div>
            <a href="/signin" style={{
              display: "inline-block",
              padding: "11px 28px", borderRadius: 9,
              background: "#0a0a0a", color: "#ffffff",
              fontSize: 13, fontWeight: 700, textDecoration: "none",
              fontFamily: "'Sora', sans-serif",
            }}>
              Go to sign in
            </a>
          </div>
        ) : (
          <form onSubmit={handleSubmit}>
            <div style={{ marginBottom: 16 }}>
              <label style={{ display: "block", fontSize: 13, fontWeight: 600, color: "#0f0f0f", marginBottom: 7 }}>Full name</label>
              <input
                type="text" placeholder="Alex Chen" value={fullName}
                onChange={(e) => setFullName(e.target.value)} required style={inputStyle}
                onFocus={(e) => { e.currentTarget.style.borderColor = "#0f0f0f"; e.currentTarget.style.boxShadow = "0 0 0 3px rgba(15,15,15,0.06)"; }}
                onBlur={(e) => { e.currentTarget.style.borderColor = "#e6e3dc"; e.currentTarget.style.boxShadow = "none"; }}
              />
            </div>

            <div style={{ marginBottom: 16 }}>
              <label style={{ display: "block", fontSize: 13, fontWeight: 600, color: "#0f0f0f", marginBottom: 7 }}>Email</label>
              <input
                type="email" placeholder="you@school.edu" value={email}
                onChange={(e) => setEmail(e.target.value)} required style={inputStyle}
                onFocus={(e) => { e.currentTarget.style.borderColor = "#0f0f0f"; e.currentTarget.style.boxShadow = "0 0 0 3px rgba(15,15,15,0.06)"; }}
                onBlur={(e) => { e.currentTarget.style.borderColor = "#e6e3dc"; e.currentTarget.style.boxShadow = "none"; }}
              />
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 22 }}>
              <div>
                <label style={{ display: "block", fontSize: 13, fontWeight: 600, color: "#0f0f0f", marginBottom: 7 }}>Password</label>
                <input
                  type="password" value={password}
                  onChange={(e) => setPassword(e.target.value)} required minLength={8} style={inputStyle}
                  onFocus={(e) => { e.currentTarget.style.borderColor = "#0f0f0f"; e.currentTarget.style.boxShadow = "0 0 0 3px rgba(15,15,15,0.06)"; }}
                  onBlur={(e) => { e.currentTarget.style.borderColor = "#e6e3dc"; e.currentTarget.style.boxShadow = "none"; }}
                />
              </div>
              <div>
                <label style={{ display: "block", fontSize: 13, fontWeight: 600, color: "#0f0f0f", marginBottom: 7 }}>Confirm</label>
                <input
                  type="password" value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)} required minLength={8} style={inputStyle}
                  onFocus={(e) => { e.currentTarget.style.borderColor = "#0f0f0f"; e.currentTarget.style.boxShadow = "0 0 0 3px rgba(15,15,15,0.06)"; }}
                  onBlur={(e) => { e.currentTarget.style.borderColor = "#e6e3dc"; e.currentTarget.style.boxShadow = "none"; }}
                />
              </div>
            </div>

            {error && (
              <div style={{
                padding: "11px 14px", borderRadius: 9, background: "#fef2f2",
                border: "1px solid #fecaca", color: "#b91c1c",
                fontSize: 13, fontWeight: 500, marginBottom: 16, lineHeight: 1.5,
              }}>{error}</div>
            )}

            <button
              type="submit" disabled={submitting}
              style={{
                width: "100%", height: 48, borderRadius: 10, border: "none",
                background: "#0a0a0a", color: "#ffffff",
                fontSize: 14, fontWeight: 700, fontFamily: "'Sora', sans-serif",
                cursor: submitting ? "not-allowed" : "pointer",
                opacity: submitting ? 0.55 : 1,
                transition: "opacity 0.15s, transform 0.06s",
                marginBottom: 14,
              }}
              onMouseDown={(e) => { if (!submitting) e.currentTarget.style.transform = "scale(0.99)"; }}
              onMouseUp={(e) => { e.currentTarget.style.transform = "scale(1)"; }}
              onMouseLeave={(e) => { e.currentTarget.style.transform = "scale(1)"; }}
            >
              {submitting ? "Creating account..." : "Create Account"}
            </button>

            <div style={{ fontSize: 11.5, color: "#9a9a9a", lineHeight: 1.55, textAlign: "center", marginBottom: 22 }}>
              By creating an account, you agree to our{" "}
              <a href="/terms" target="_blank" rel="noopener noreferrer" style={{ color: "#5c5c5c", textDecoration: "underline", textUnderlineOffset: 2 }}>Terms of Service</a>
              {" "}and{" "}
              <a href="/privacy" target="_blank" rel="noopener noreferrer" style={{ color: "#5c5c5c", textDecoration: "underline", textUnderlineOffset: 2 }}>Privacy Policy</a>.
            </div>
          </form>
        )}

        {!success && (
          <div style={{ textAlign: "center", fontSize: 13.5, color: "#5c5c5c", marginBottom: 32 }}>
            Already have an account?{" "}
            <a href="/signin" style={{ color: "#0a0a0a", fontWeight: 700, textDecoration: "none" }}>Sign in</a>
          </div>
        )}

        <div style={{ height: 1, background: "#e6e6e6", margin: success ? "32px 0 22px 0" : "0 0 22px 0" }} />

        <div style={{
          textAlign: "center", fontSize: 11, color: "#9a9a9a",
          display: "flex", gap: 14, justifyContent: "center", flexWrap: "wrap",
        }}>
          <a href="/privacy" style={{ color: "#9a9a9a", textDecoration: "none" }}>Privacy</a>
          <span>·</span>
          <a href="/terms" style={{ color: "#9a9a9a", textDecoration: "none" }}>Terms</a>
          <span>·</span>
          <a href="/refund" style={{ color: "#9a9a9a", textDecoration: "none" }}>Refund</a>
          <span>·</span>
          <a href="/cookies" style={{ color: "#9a9a9a", textDecoration: "none" }}>Cookies</a>
        </div>
      </div>

      <div style={{ flex: 1, minHeight: 32 }} />
    </div>
  );
}

export default function SignupPage() {
  return <MobileGate><SignupContent /></MobileGate>;
}
