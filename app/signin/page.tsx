"use client";

import { useState } from "react";
import { useMutation } from "convex/react";
import { useRouter } from "next/navigation";
import { api } from "../../convex/_generated/api";

export default function SigninPage() {
  const router = useRouter();
  const signIn = useMutation((api as any).auth?.signIn);
  const generateVerificationToken = useMutation((api as any).auth?.generateVerificationToken);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [resendStatus, setResendStatus] = useState<"idle" | "loading" | "sent" | "error">("idle");

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setError(null);

    try {
      setSubmitting(true);
      const result = await signIn({ email, password });
      const userId = (result && (result.userId ?? result.id ?? result)) ?? undefined;
      if (typeof window !== "undefined" && userId) {
        const id = String(userId);
        window.localStorage.setItem("offerbell_user_id", id);
        window.localStorage.setItem("offerbell_messages_sent", String(result?.outreachCount || 0));
        document.cookie = `offerbell_user_id=${encodeURIComponent(id)}; path=/; max-age=${60 * 60 * 24 * 30}`;
        // Restore plan from database
        const plan = result?.plan || 'free';
        window.localStorage.setItem("offerbell_plan", plan);
        if (result?.planActivatedAt) {
          window.localStorage.setItem("offerbell_plan_activated_at", String(result.planActivatedAt));
        }
        if (result?.promoCode) {
          window.localStorage.setItem("offerbell_promo_code", result.promoCode);
        }
        // Also update profile if it exists
        try {
          const raw = window.localStorage.getItem("offerbell_onboarding_profile");
          if (raw) {
            const existing = JSON.parse(raw);
            existing.plan = plan;
            if (result?.planActivatedAt) existing.planActivatedAt = result.planActivatedAt;
            if (result?.promoCode) { existing.promoCode = result.promoCode; existing.promoApplied = true; }
            window.localStorage.setItem("offerbell_onboarding_profile", JSON.stringify(existing));
          }
        } catch {}
      }
      // Send all users to dashboard — tutorial handles first-time setup
      if (typeof window !== "undefined" && window.localStorage.getItem("offerbell_needs_onboarding")) {
        window.localStorage.removeItem("offerbell_needs_onboarding");
        router.push("/dashboard");
      } else {
        // Existing user — create default profile if missing and go to dashboard
        if (typeof window !== "undefined" && !window.localStorage.getItem("offerbell_onboarding_profile")) {
          const nm = result?.name || "";
          const pts = nm.split(" ");
          window.localStorage.setItem("offerbell_onboarding_profile", JSON.stringify({
            firstName: pts[0] || "",
            lastName: pts.slice(1).join(" ") || "",
            university: "",
            targetRoles: [],
            targetFirms: [],
            major: "",
            year: "",
            recruitYear: "",
            email: email,
          }));
        }
        router.push("/dashboard");
      }
    } catch (err: any) {
      console.error("Sign in failed", err);
      const msg = err?.data ? String(err.data) : (err instanceof Error ? err.message : (err?.message || "Invalid email or password."));
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
    <div style={{ minHeight: "100vh", display: "flex", background: "#0a0a0a" }}>
      {/* Left brand panel */}
      <div style={{ width: 420, background: "#0a0a0a", color: "#fff", padding: "48px 40px", display: "flex", flexDirection: "column", justifyContent: "space-between", flexShrink: 0 }}>
        <div>
          <div style={{ fontFamily: "'Instrument Serif', serif", fontSize: 24, letterSpacing: "-.5px", marginBottom: 64 }}>
            <a href="/" style={{ color: "#fff", textDecoration: "none" }}>OfferBell<em style={{ fontStyle: "italic" }}>.</em></a>
          </div>
          <div style={{ fontFamily: "'Instrument Serif', serif", fontSize: 38, lineHeight: 1.15, letterSpacing: "-1px", marginBottom: 16 }}>
            Welcome <em style={{ fontStyle: "italic" }}>back.</em>
          </div>
          <div style={{ fontSize: 14, color: "rgba(255,255,255,.45)", lineHeight: 1.7 }}>
            Sign in to access your dashboard, outreach tools, and recruiting resources.
          </div>
        </div>
        <div style={{ fontSize: 12, color: "rgba(255,255,255,.2)" }}>
          kynectedofficial@gmail.com
        </div>
      </div>

      {/* Right form panel */}
      <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", background: "#f8f8f7", padding: 40 }}>
        <div style={{ width: "100%", maxWidth: 420 }}>
          <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: 1.5, textTransform: "uppercase", color: "#9e9b96", marginBottom: 12 }}>Sign In</div>
          <div style={{ fontFamily: "'Instrument Serif', serif", fontSize: 30, letterSpacing: "-.5px", color: "#0a0a0a", marginBottom: 8 }}>
            Continue where you <em style={{ fontStyle: "italic" }}>left off</em>
          </div>
          <div style={{ fontSize: 14, color: "#6b6860", marginBottom: 36 }}>
            Enter your credentials to access your account.
          </div>

          <form onSubmit={handleSubmit}>
            <div style={{ marginBottom: 18 }}>
              <label style={{ display: "block", fontSize: 13, fontWeight: 600, color: "#0a0a0a", marginBottom: 6 }}>Email</label>
              <input
                type="email" placeholder="you@school.edu" value={email}
                onChange={(e) => setEmail(e.target.value)} required
                style={inp}
                onFocus={(e) => { e.currentTarget.style.borderColor = "#0a0a0a"; e.currentTarget.style.boxShadow = "0 0 0 3px rgba(10,10,10,0.06)"; }}
                onBlur={(e) => { e.currentTarget.style.borderColor = "#e4e2de"; e.currentTarget.style.boxShadow = "none"; }}
              />
            </div>

            <div style={{ marginBottom: 24 }}>
              <label style={{ display: "block", fontSize: 13, fontWeight: 600, color: "#0a0a0a", marginBottom: 6 }}>Password</label>
              <input
                type="password" value={password}
                onChange={(e) => setPassword(e.target.value)} required minLength={8}
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

            {error && error.toLowerCase().includes("verify your email") && (
              <div style={{ marginBottom: 18, textAlign: "center" }}>
                {resendStatus === "sent" ? (
                  <div style={{ color: "#16a34a", fontSize: 13, fontWeight: 500 }}>
                    Verification email sent! Please check your inbox.
                  </div>
                ) : (
                  <button
                    type="button"
                    disabled={resendStatus === "loading"}
                    onClick={async () => {
                      try {
                        setResendStatus("loading");
                        const res = await generateVerificationToken({ email });
                        const emailRes = await fetch("/api/send-verification", {
                          method: "POST",
                          headers: { "Content-Type": "application/json" },
                          body: JSON.stringify({ email, token: res.verificationToken, name: res.name })
                        });
                        if (!emailRes.ok) throw new Error("Failed");
                        setResendStatus("sent");
                      } catch (err: any) {
                        console.error(err);
                        setResendStatus("error");
                      }
                    }}
                    style={{
                      background: "none", border: "none", color: "#6b6860", textDecoration: "underline",
                      fontSize: 13, cursor: "pointer", fontWeight: 500
                    }}
                  >
                    {resendStatus === "loading" ? "Sending..." : "Didn't receive the email? Click to resend."}
                  </button>
                )}
                {resendStatus === "error" && (
                  <div style={{ color: "#dc2626", fontSize: 12, marginTop: 4 }}>Failed to send. Please try again.</div>
                )}
              </div>
            )}

            <div style={{ textAlign: "right", marginTop: "-12px", marginBottom: "20px" }}>
              <a href="/forgot-password" style={{ color: "#6b6860", fontSize: 13, textDecoration: "none", fontWeight: 500 }}>
                Forgot password?
              </a>
            </div>

            <button
              type="submit" disabled={submitting}
              style={{
                width: "100%", height: 48, borderRadius: 10, border: "none",
                background: "#0a0a0a", color: "#ffffff", fontSize: 14, fontWeight: 700,
                fontFamily: "'Sora', sans-serif", cursor: submitting ? "not-allowed" : "pointer",
                opacity: submitting ? 0.6 : 1, display: "flex", alignItems: "center",
                justifyContent: "center", gap: 8, marginBottom: 20,
              }}
            >
              {submitting ? "Signing in..." : "Sign in"}
            </button>
          </form>

          <div style={{ textAlign: "center", fontSize: 13, color: "#6b6860" }}>
            Don&apos;t have an account?{" "}
            <a href="/signup" style={{ color: "#0a0a0a", fontWeight: 700, textDecoration: "none" }}>
              Sign up
            </a>
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
