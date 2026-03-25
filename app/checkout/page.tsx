"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import "../contact-finder/contact-finder.css";

export default function CheckoutPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [isDark, setIsDark] = useState(false);
  const [isPro, setIsPro] = useState(false);

  useEffect(() => {
    const theme = localStorage.getItem("offerbell-theme");
    if (theme === "dark") { document.documentElement.setAttribute("data-theme", "dark"); setIsDark(true); }
    const plan = localStorage.getItem("offerbell_plan");
    if (plan === "pro") setIsPro(true);
    try {
      const raw = localStorage.getItem("offerbell_onboarding_profile");
      if (raw) {
        const p = JSON.parse(raw);
        setEmail(p.email || "");
        if (p.plan === "pro") setIsPro(true);
      }
    } catch {}
  }, []);

  const handleCheckout = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();
      if (data.url) {
        window.location.href = data.url;
      } else {
        setLoading(false);
        alert("Something went wrong. Please try again.");
      }
    } catch {
      setLoading(false);
      alert("Something went wrong. Please try again.");
    }
  };

  if (isPro) {
    return (
      <div style={{ minHeight: "100vh", background: "var(--bg)", display: "flex", alignItems: "center", justifyContent: "center", padding: 24 }}>
        <div style={{ width: "100%", maxWidth: 480, background: "var(--surface)", border: "1.5px solid var(--border)", borderRadius: 20, padding: "40px 32px", textAlign: "center" }}>
          <div style={{ width: 56, height: 56, borderRadius: "50%", background: "#ecfdf5", color: "#10b981", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 20px", fontSize: 24 }}>
            ✓
          </div>
          <div style={{ fontFamily: "'Instrument Serif', serif", fontSize: 28, color: "var(--text)", marginBottom: 8 }}>
            You&apos;re on <em>Pro</em>
          </div>
          <div style={{ fontSize: 14, color: "var(--text-3)", marginBottom: 32, lineHeight: 1.6 }}>
            You have full access to all OfferBell features including unlimited outreach messages, Contact Finder, AI Coach, and more.
          </div>

          <div style={{ background: "var(--bg)", border: "1px solid var(--border)", borderRadius: 12, padding: 20, marginBottom: 24, textAlign: "left" }}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 12 }}>
              <span style={{ fontSize: 13, color: "var(--text-3)" }}>Plan</span>
              <span style={{ fontSize: 13, fontWeight: 700, color: "var(--text)" }}>OfferBell Pro</span>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 12 }}>
              <span style={{ fontSize: 13, color: "var(--text-3)" }}>Billing</span>
              <span style={{ fontSize: 13, fontWeight: 700, color: "var(--text)" }}>$20/month</span>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <span style={{ fontSize: 13, color: "var(--text-3)" }}>Status</span>
              <span style={{ fontSize: 13, fontWeight: 700, color: "#16a34a" }}>Active</span>
            </div>
          </div>

          <div style={{ fontSize: 12, color: "var(--text-3)", marginBottom: 24, lineHeight: 1.6 }}>
            To cancel or update your payment method, manage your subscription through Stripe by contacting us at kynectofficial@gmail.com.
          </div>

          <button
            onClick={() => router.push("/dashboard")}
            style={{
              width: "100%", padding: "14px 0",
              background: "var(--text)", color: "var(--surface)",
              borderRadius: 12, border: "none", fontSize: 14, fontWeight: 700,
              cursor: "pointer", fontFamily: "'Sora', sans-serif",
            }}
          >
            Back to Dashboard
          </button>
        </div>
      </div>
    );
  }

  return (
    <div style={{ minHeight: "100vh", background: "var(--bg)", display: "flex", animation: "checkoutIn 0.4s ease both", alignItems: "center", justifyContent: "center", padding: 24 }}>
      <div style={{ width: "100%", maxWidth: 900, display: "grid", gridTemplateColumns: "1.1fr 0.9fr", gap: 48, alignItems: "start" }}>

        {/* LEFT - Order Summary */}
        <div>
          <div style={{ fontFamily: "'Instrument Serif', serif", fontSize: 24, letterSpacing: "-.3px", color: "var(--text)", marginBottom: 4 }}>
            OfferBell<em style={{ fontStyle: "italic" }}>.</em>
          </div>
          <div style={{ fontSize: 13, color: "var(--text-3)", marginBottom: 36 }}>Complete your Pro subscription</div>

          <div style={{ background: "var(--surface)", border: "1.5px solid var(--border)", borderRadius: 16, padding: 24, marginBottom: 20 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20, paddingBottom: 20, borderBottom: "1px solid var(--border)" }}>
              <div>
                <div style={{ fontSize: 17, fontWeight: 700, color: "var(--text)", marginBottom: 2 }}>OfferBell Pro</div>
                <div style={{ fontSize: 12, color: "var(--text-3)" }}>Monthly subscription — cancel anytime</div>
              </div>
              <div style={{ fontFamily: "'Instrument Serif', serif", fontSize: 28, color: "var(--text)" }}>$20<span style={{ fontSize: 14, fontFamily: "'Sora', sans-serif", color: "var(--text-3)", fontWeight: 400 }}>/mo</span></div>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: 12, fontSize: 13, color: "var(--text-2)" }}>
              {[
                "Unlimited outreach messages",
                "Unlimited Contact Finder access",
                "AI Coach — 24/7 recruiting advisor",
                "Hit Rate Intel — see what angles get replies",
                "Resume & cover letter reviews",
                "Priority support & early feature access",
                "Everything in Free plan included",
              ].map((f, i) => (
                <div key={i} style={{ display: "flex", gap: 8, alignItems: "center" }}>
                  <svg width="15" height="15" fill="none" stroke="#16a34a" strokeWidth="2" viewBox="0 0 24 24" style={{ flexShrink: 0 }}><polyline points="20 6 9 17 4 12"/></svg>
                  {f}
                </div>
              ))}
            </div>

            <div style={{ marginTop: 24, paddingTop: 16, borderTop: "1px solid var(--border)", display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
              <div style={{ fontSize: 14, fontWeight: 600, color: "var(--text)" }}>Due today</div>
              <div style={{ fontFamily: "'Instrument Serif', serif", fontSize: 32, color: "var(--text)" }}>$20.00</div>
            </div>
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 12, color: "var(--text-3)" }}>
            <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
            Secure checkout powered by Stripe. Cancel anytime.
          </div>
        </div>

        {/* RIGHT - Checkout Button */}
        <div style={{ background: "var(--surface)", border: "1.5px solid var(--border)", borderRadius: 20, padding: "36px 28px" }}>
          <div style={{ fontSize: 17, fontWeight: 700, color: "var(--text)", marginBottom: 4 }}>Ready to go Pro?</div>
          <div style={{ fontSize: 13, color: "var(--text-3)", marginBottom: 28, lineHeight: 1.6 }}>You&apos;ll be redirected to Stripe&apos;s secure checkout to enter your payment details.</div>

          <div style={{ marginBottom: 20 }}>
            <label style={{ display: "block", fontSize: 12, fontWeight: 600, color: "var(--text)", marginBottom: 6 }}>Email address</label>
            <input
              type="email" value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@school.edu"
              style={{
                width: "100%", height: 48, padding: "0 16px",
                border: "1.5px solid var(--border-2)", borderRadius: 10,
                fontSize: 14, fontFamily: "'Sora', sans-serif",
                color: "var(--text)", background: "var(--bg)", outline: "none",
              }}
            />
          </div>

          <button
            onClick={handleCheckout}
            disabled={loading}
            type="button"
            style={{
              width: "100%", padding: "15px 0",
              background: "var(--text)", color: "var(--surface)",
              borderRadius: 12, border: "none", fontSize: 14, fontWeight: 700,
              cursor: loading ? "not-allowed" : "pointer",
              fontFamily: "'Sora', sans-serif",
              opacity: loading ? 0.6 : 1,
              display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
              marginBottom: 16,
            }}
          >
            {loading ? (
              <>
                <div style={{ width: 16, height: 16, border: "2px solid rgba(255,255,255,.3)", borderTopColor: "#fff", borderRadius: "50%", animation: "spin .7s linear infinite" }} />
                Redirecting to Stripe...
              </>
            ) : (
              "Subscribe — $20/mo"
            )}
          </button>

          <button
            onClick={() => {
              try {
                const raw = localStorage.getItem("offerbell_onboarding_profile");
                const existing = raw ? JSON.parse(raw) : {};
                localStorage.setItem("offerbell_onboarding_profile", JSON.stringify({ ...existing, plan: "free" }));
                localStorage.setItem("offerbell_plan", "free");
              } catch {}
              router.push("/dashboard");
            }}
            type="button"
            style={{
              width: "100%", padding: "12px 0",
              background: "none", color: "var(--text-3)",
              borderRadius: 10, border: "1.5px solid var(--border-2)",
              fontSize: 13, fontWeight: 500, cursor: "pointer",
              fontFamily: "'Sora', sans-serif",
            }}
          >
            Skip for now — continue with Free
          </button>

          <div style={{ textAlign: "center", marginTop: 16, fontSize: 11, color: "var(--text-3)", lineHeight: 1.6 }}>
            By subscribing you agree to our Terms of Service.<br />Cancel anytime from your account settings.
          </div>

          <style>{`@keyframes spin { to { transform: rotate(360deg) } }`}</style>
        </div>
      </div>
    </div>
  );
}
