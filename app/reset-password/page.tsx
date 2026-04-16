"use client";

import { useEffect, useState, Suspense } from "react";
import { useMutation } from "convex/react";
import { useSearchParams, useRouter } from "next/navigation";
import { api } from "../../convex/_generated/api";

function ResetPasswordContent() {
  const searchParams = useSearchParams();
  const token = searchParams.get("token");
  const resetPassword = useMutation((api as any).auth?.resetPassword);
  const router = useRouter();

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    if (!token) {
      setError("No reset token found. Please request a new password reset link.");
    }
  }, [token]);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setError(null);

    if (!token) return;
    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    try {
      setSubmitting(true);
      await resetPassword({ token, newPassword: password });
      setSuccess(true);
    } catch (err: any) {
      console.error("Reset password failed", err);
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
        <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: 1.5, textTransform: "uppercase", color: "#9e9b96", marginBottom: 12 }}>Reset Password</div>
        <div style={{ fontFamily: "'Instrument Serif', serif", fontSize: 30, letterSpacing: "-.5px", color: "#0a0a0a", marginBottom: 8 }}>
          {success ? "Password Updated" : <>Choose a new <em style={{ fontStyle: "italic" }}>password</em></>}
        </div>
        <div style={{ fontSize: 14, color: "#6b6860", marginBottom: 36 }}>
          {success ? "Your password has been successfully reset." : "Please enter your new secure password below."}
        </div>

        {success ? (
          <div>
            <div style={{ width: 48, height: 48, borderRadius: "50%", background: "#ecfdf5", color: "#10b981", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 0 24px 0" }}>
              <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7"></path></svg>
            </div>
            <button
              onClick={() => {
                // Clear any stale session data before going to signin
                // so orphaned keys from a previous signup test or
                // different account can't interfere with the signin flow
                if (typeof window !== 'undefined') {
                  const allKeys: string[] = [];
                  for (let i = 0; i < localStorage.length; i++) {
                    const k = localStorage.key(i);
                    if (k && k.startsWith('offerbell') && k !== 'offerbell-theme') allKeys.push(k);
                  }
                  allKeys.forEach(k => localStorage.removeItem(k));
                  document.cookie = 'offerbell_user_id=; path=/; max-age=0';
                }
                router.push("/signin");
              }}
              style={{
                width: "100%", height: 48, borderRadius: 10, border: "none",
                background: "#0a0a0a", color: "#ffffff", fontSize: 14, fontWeight: 700,
                fontFamily: "'Sora', sans-serif", cursor: "pointer"
              }}
            >
              Back to Sign In
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit}>
            <div style={{ marginBottom: 16 }}>
              <label style={{ display: "block", fontSize: 13, fontWeight: 600, color: "#0a0a0a", marginBottom: 6 }}>New Password</label>
              <input
                type="password" value={password} minLength={6}
                onChange={(e) => setPassword(e.target.value)} required
                style={inp}
                onFocus={(e) => { e.currentTarget.style.borderColor = "#0a0a0a"; e.currentTarget.style.boxShadow = "0 0 0 3px rgba(10,10,10,0.06)"; }}
                onBlur={(e) => { e.currentTarget.style.borderColor = "#e4e2de"; e.currentTarget.style.boxShadow = "none"; }}
              />
            </div>

            <div style={{ marginBottom: 24 }}>
              <label style={{ display: "block", fontSize: 13, fontWeight: 600, color: "#0a0a0a", marginBottom: 6 }}>Confirm New Password</label>
              <input
                type="password" value={confirmPassword} minLength={6}
                onChange={(e) => setConfirmPassword(e.target.value)} required
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
              type="submit" disabled={submitting || !token}
              style={{
                width: "100%", height: 48, borderRadius: 10, border: "none",
                background: "#0a0a0a", color: "#ffffff", fontSize: 14, fontWeight: 700,
                fontFamily: "'Sora', sans-serif", cursor: submitting || !token ? "not-allowed" : "pointer",
                opacity: submitting || !token ? 0.6 : 1, marginBottom: 20,
              }}
            >
              {submitting ? "Updating..." : "Reset Password"}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={<div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "#f8f8f7" }}>Loading...</div>}>
      <ResetPasswordContent />
    </Suspense>
  );
}
