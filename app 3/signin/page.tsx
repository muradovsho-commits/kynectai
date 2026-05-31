"use client";

import { useState } from "react";
import { useMutation } from "convex/react";
import { useRouter } from "next/navigation";
import { ConvexHttpClient } from "convex/browser";
import { api } from "../../convex/_generated/api";
import MobileGate from "../components/MobileGate";

function SigninContent() {
  const router = useRouter();
  // Used only by the "resend verification email" path. Sign-in itself goes
  // through /api/auth/signin so the server can rate-limit and issue a
  // signed HttpOnly cookie.
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
      // Server-side signin: rate-limited, HMAC-signed HttpOnly cookie issued
      // by the API route. We never call Convex auth.signIn directly from the
      // client anymore - that bypassed cookie signing.
      const res = await fetch("/api/auth/signin", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const result = await res.json();
      if (!res.ok) {
        throw new Error(result?.error || "Invalid email or password.");
      }
      const userId = result?.userId ?? result?.id ?? result;
      if (typeof window !== "undefined" && userId) {
        const id = String(userId);

        // ── ALWAYS clear previous session data to prevent any bleed-over ──
        // We preserve only offerbell-theme (visual preference).
        const allKeys: string[] = [];
        for (let i = 0; i < localStorage.length; i++) {
          const k = localStorage.key(i);
          if (k && k.startsWith('offerbell') && k !== 'offerbell-theme') allKeys.push(k);
        }
        allKeys.forEach(k => localStorage.removeItem(k));

        // ── Write the new session ──
        // Cookie is set HttpOnly by the server. We only mirror userId to
        // localStorage for client-side reads (page mount hydration).
        let finalPlan = result?.plan || 'free';
        window.localStorage.setItem("offerbell_user_id", id);
        window.localStorage.setItem("offerbell_messages_sent", String(result?.outreachCount || 0));
        if (result?.planActivatedAt) {
          window.localStorage.setItem("offerbell_plan_activated_at", String(result.planActivatedAt));
        }
        if (result?.promoCode) {
          window.localStorage.setItem("offerbell_promo_code", result.promoCode);
        }

        // Sync any user data Convex returned so the dashboard hydrates fast
        try {
          if (result?.onboardingComplete !== undefined) {
            window.localStorage.setItem("offerbell_onboarding_complete", String(!!result.onboardingComplete));
          }
          if (result && typeof result === "object") {
            const profile: any = {};
            for (const key of Object.keys(result)) {
              if (key === 'offerbell_onboarding_profile') {
                try { Object.assign(profile, JSON.parse(result[key] || '{}')); } catch {}
              } else if (typeof result[key] !== 'object') {
                profile[key] = result[key];
              }
            }
            if (Object.keys(profile).length > 0) {
              window.localStorage.setItem("offerbell_onboarding_profile", JSON.stringify(profile));
            }
          }
        } catch {}

        // Hydrate progress (resume reviews, drill history, etc.) before
        // navigating away so the dashboard loads ready, not blank.
        try {
          const convex = new ConvexHttpClient(process.env.NEXT_PUBLIC_CONVEX_URL!);
          const progress = await convex.query((api as any).progress?.loadProgress, { userId: id });
          if (progress && typeof progress === 'object') {
            for (const key of Object.keys(progress)) {
              if (typeof (progress as any)[key] === 'string') {
                window.localStorage.setItem(key, (progress as any)[key]);
              }
            }
          }
        } catch (e) { /* dashboard will pull again on mount */ }

        window.localStorage.setItem("offerbell_plan", finalPlan);

        // Tell the chrome extension (if installed) that we just signed in,
        // so it can grab the new session for outreach-from-Gmail features.
        try {
          if ((window as any).chrome?.runtime?.sendMessage) {
            const extId = process.env.NEXT_PUBLIC_EXTENSION_ID;
            if (extId) {
              (window as any).chrome.runtime.sendMessage(extId, { type: "OFFERBELL_SIGNIN", userId: id });
            }
          }
        } catch {}
      }
      router.push("/dashboard");
    } catch (err: any) {
      const msg = err?.data ? String(err.data) : (err instanceof Error ? err.message : (err?.message || "Sign-in failed."));
      setError(msg.replace("Uncaught Error: ", ""));
      console.error("Sign in failed", err);
    } finally {
      setSubmitting(false);
    }
  };

  // ════════════════════════════════════════════════════════════════════════
  // NEW DESIGN — Single-column, centered, premium auth aesthetic.
  // Cream background (#fafafa matches landing var(--cream)), Instrument
  // Serif italic emphasis, minimal chrome. All handler logic above unchanged.
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
      {/* ───────── Top bar: explicit back link, top-left ─────────
          Plain "← Back to home" text so it's unambiguous. */}
      <div style={{
        width: "100%",
        maxWidth: 920,
        marginBottom: 40,
      }}>
        <a href="/" style={{
          display: "inline-flex",
          alignItems: "center",
          gap: 6,
          color: "#5c5c5c",
          textDecoration: "none",
          fontSize: 14,
          fontWeight: 600,
          padding: "8px 14px",
          borderRadius: 8,
          background: "#ffffff",
          border: "1.5px solid #e6e3dc",
          transition: "border-color 0.15s, color 0.15s",
        }}
        onMouseOver={(e) => { e.currentTarget.style.borderColor = "#0f0f0f"; e.currentTarget.style.color = "#0f0f0f"; }}
        onMouseOut={(e) => { e.currentTarget.style.borderColor = "#e6e3dc"; e.currentTarget.style.color = "#5c5c5c"; }}
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M19 12H5M12 19l-7-7 7-7" />
          </svg>
          Back to home
        </a>
      </div>

      {/* Centered wordmark below the back link */}
      <a href="/" style={{
        fontFamily: "'Instrument Serif', 'Times New Roman', serif",
        fontSize: 26,
        letterSpacing: "-0.5px",
        color: "#0f0f0f",
        textDecoration: "none",
        marginBottom: 40,
      }}>
        OfferBell<em style={{ fontStyle: "italic" }}>.</em>
      </a>

      <div style={{ width: "100%", maxWidth: 420 }}>
        <div style={{
          fontSize: 11, fontWeight: 700, letterSpacing: 1.6, textTransform: "uppercase",
          color: "#9a9a9a", marginBottom: 14,
        }}>Sign In</div>

        <h1 style={{
          fontFamily: "'Instrument Serif', 'Times New Roman', serif",
          fontSize: 48, fontWeight: 400, letterSpacing: "-1.2px", lineHeight: 1.05,
          margin: "0 0 14px 0",
        }}>
          Welcome <em style={{ fontStyle: "italic" }}>back</em>.
        </h1>

        <p style={{ fontSize: 14, color: "#5c5c5c", lineHeight: 1.6, margin: "0 0 36px 0" }}>
          Pick up where you left off &mdash; your dashboard, outreach, and prep are waiting.
        </p>

        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: 16 }}>
            <label style={{ display: "block", fontSize: 13, fontWeight: 600, color: "#0f0f0f", marginBottom: 7 }}>Email</label>
            <input
              type="email" placeholder="you@school.edu" value={email}
              onChange={(e) => setEmail(e.target.value)} required style={inputStyle}
              onFocus={(e) => { e.currentTarget.style.borderColor = "#0f0f0f"; e.currentTarget.style.boxShadow = "0 0 0 3px rgba(15,15,15,0.06)"; }}
              onBlur={(e) => { e.currentTarget.style.borderColor = "#e6e3dc"; e.currentTarget.style.boxShadow = "none"; }}
            />
          </div>

          <div style={{ marginBottom: 8 }}>
            <label style={{ display: "block", fontSize: 13, fontWeight: 600, color: "#0f0f0f", marginBottom: 7 }}>Password</label>
            <input
              type="password" value={password} onChange={(e) => setPassword(e.target.value)}
              required minLength={8} style={inputStyle}
              onFocus={(e) => { e.currentTarget.style.borderColor = "#0f0f0f"; e.currentTarget.style.boxShadow = "0 0 0 3px rgba(15,15,15,0.06)"; }}
              onBlur={(e) => { e.currentTarget.style.borderColor = "#e6e3dc"; e.currentTarget.style.boxShadow = "none"; }}
            />
          </div>

          <div style={{ textAlign: "right", marginBottom: 22 }}>
            <a href="/forgot-password" style={{ color: "#5c5c5c", fontSize: 13, textDecoration: "none", fontWeight: 500 }}>
              Forgot password?
            </a>
          </div>

          {error && (
            <div style={{
              padding: "11px 14px", borderRadius: 9, background: "#fef2f2",
              border: "1px solid #fecaca", color: "#b91c1c",
              fontSize: 13, fontWeight: 500, marginBottom: 16, lineHeight: 1.5,
            }}>{error}</div>
          )}

          {error && error.toLowerCase().includes("verify your email") && (
            <div style={{ marginBottom: 16, textAlign: "center" }}>
              {resendStatus === "sent" ? (
                <div style={{ color: "#15803d", fontSize: 13, fontWeight: 500 }}>
                  Verification email sent. Check your inbox.
                </div>
              ) : (
                <button
                  type="button" disabled={resendStatus === "loading"}
                  onClick={async () => {
                    try {
                      setResendStatus("loading");
                      const res = await generateVerificationToken({ email });
                      const emailRes = await fetch("/api/send-verification", {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({ email, token: res.verificationToken, name: res.name }),
                      });
                      if (!emailRes.ok) throw new Error("Failed");
                      setResendStatus("sent");
                    } catch (err: any) {
                      console.error(err);
                      setResendStatus("error");
                    }
                  }}
                  style={{
                    background: "none", border: "none", color: "#5c5c5c",
                    textDecoration: "underline", textUnderlineOffset: 2,
                    fontSize: 13, cursor: resendStatus === "loading" ? "not-allowed" : "pointer",
                    fontWeight: 500, opacity: resendStatus === "loading" ? 0.6 : 1,
                  }}
                >
                  {resendStatus === "loading" ? "Sending..." : "Didn't get the email? Resend it."}
                </button>
              )}
              {resendStatus === "error" && (
                <div style={{ color: "#b91c1c", fontSize: 12, marginTop: 6 }}>
                  Failed to send. Please try again in a moment.
                </div>
              )}
            </div>
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
              marginBottom: 22,
            }}
            onMouseDown={(e) => { if (!submitting) e.currentTarget.style.transform = "scale(0.99)"; }}
            onMouseUp={(e) => { e.currentTarget.style.transform = "scale(1)"; }}
            onMouseLeave={(e) => { e.currentTarget.style.transform = "scale(1)"; }}
          >
            {submitting ? "Signing in..." : "Sign in"}
          </button>
        </form>

        <div style={{ textAlign: "center", fontSize: 13.5, color: "#5c5c5c", marginBottom: 32 }}>
          Don&apos;t have an account?{" "}
          <a href="/signup" style={{ color: "#0a0a0a", fontWeight: 700, textDecoration: "none" }}>Sign up</a>
        </div>

        <div style={{ height: 1, background: "#e6e6e6", margin: "0 0 22px 0" }} />

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

export default function SigninPage() {
  return <MobileGate><SigninContent /></MobileGate>;
}
