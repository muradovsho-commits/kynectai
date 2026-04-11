"use client";

import { useState } from "react";
import { useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";

export default function ForgotPasswordPage() {
  const requestReset = useMutation((api as any).auth?.requestPasswordReset);

  const [email, setEmail] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setError(null);

    try {
      setSubmitting(true);
      const result = await requestReset({ email });
      
      const resetToken = result?.resetToken;
      const name = result?.name || "there";
      
      if (resetToken) {
        // Send reset email via API route
        await fetch("/api/send-reset", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, token: resetToken, name })
        });
      }

      setSuccess(true);
    } catch (err: any) {
      console.error("Forgot password failed", err);
      const msg = err?.data ? String(err.data) : (err instanceof Error ? err.message : (err?.message || "Something went wrong."));
      setError(msg.replace("Uncaught Error: ", ""));
    } finally {
      setSubmitting(false);
    }
  };

  const inp: React.CSSProperties = {
    width: "100%", height: 48, padding: "0 16px",
    border: "1.5px solid #e4e2de", borderRadius: 10,
    fontSize: 14, fontFamily: "'Sora', sans-serif",
    color: "#0a0a0a", background: "#ffffff", outline: "none",
  };

  return (
    <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "#f8f8f7", padding: 40 }}>
      <div style={{ width: "100%", maxWidth: 420 }}>
        <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: 1.5, textTransform: "uppercase", color: "#9e9b96", marginBottom: 12 }}>Forgot Password</div>
        <div style={{ fontFamily: "'Instrument Serif', serif", fontSize: 30, letterSpacing: "-.5px", color: "#0a0a0a", marginBottom: 8 }}>
          {success ? "Check your inbox" : <>Reset your <em style={{ fontStyle: "italic" }}>password</em></>}
        </div>
        <div style={{ fontSize: 14, color: "#6b6860", marginBottom: 36 }}>
          {success ? "We've sent a password reset link to your email." : "Enter your email address and we'll send you a link to reset your password."}
        </div>

        {success ? (
          <div style={{ background: "#ecfdf5", border: "1px solid #d1fae5", padding: 24, borderRadius: 12, textAlign: "center" }}>
            <div style={{ width: 48, height: 48, borderRadius: "50%", background: "#d1fae5", color: "#10b981", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 16px" }}>
              <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path></svg>
            </div>
            <div style={{ fontSize: 15, fontWeight: 600, color: "#065f46" }}>Reset link sent!</div>
            <div style={{ fontSize: 14, color: "#047857", marginTop: 8 }}>Please click the link in the email to set a new password.</div>
          </div>
        ) : (
          <form onSubmit={handleSubmit}>
            <div style={{ marginBottom: 24 }}>
              <label style={{ display: "block", fontSize: 13, fontWeight: 600, color: "#0a0a0a", marginBottom: 6 }}>Email</label>
              <input
                type="email" placeholder="you@school.edu" value={email}
                onChange={(e) => setEmail(e.target.value)} required
                style={inp}
                onFocus={(e) => { e.currentTarget.style.borderColor = "#0a0a0a"; e.currentTarget.style.boxShadow = "0 0 0 3px rgba(10,10,10,0.06)"; }}
                onBlur={(e) => { e.currentTarget.style.borderColor = "#e4e2de"; e.currentTarget.style.boxShadow = "none"; }}
              />
            </div>

            {error && (
              <div style={{ padding: "10px 14px", borderRadius: 8, background: "#fef2f2", border: "1px solid #fecaca", color: "#dc2626", fontSize: 13, fontWeight: 500, marginBottom: 18 }}>
                {error}
              </div>
            )}

            <button
              type="submit" disabled={submitting}
              style={{
                width: "100%", height: 48, borderRadius: 10, border: "none",
                background: "#0a0a0a", color: "#ffffff", fontSize: 14, fontWeight: 700,
                fontFamily: "'Sora', sans-serif", cursor: submitting ? "not-allowed" : "pointer",
                opacity: submitting ? 0.6 : 1, marginBottom: 20,
              }}
            >
              {submitting ? "Sending..." : "Send Reset Link"}
            </button>
          </form>
        )}

        <div style={{ textAlign: "center", fontSize: 13, color: "#6b6860" }}>
          Remembered your password?{" "}
          <a href="/signin" style={{ color: "#0a0a0a", fontWeight: 700, textDecoration: "none" }}>
            Sign in
          </a>
        </div>
      </div>
    </div>
  );
}
