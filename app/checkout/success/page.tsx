"use client";
import { useEffect } from "react";
import { useMutation } from "convex/react";
import { useRouter } from "next/navigation";
import { api } from "../../../convex/_generated/api";

export default function CheckoutSuccessPage() {
  const router = useRouter();
  const upgradePlan = useMutation((api as any).auth?.upgradePlan);

  useEffect(() => {
    const now = Date.now();
    // Save pro plan to localStorage
    try {
      const raw = localStorage.getItem("offerbell_onboarding_profile");
      const existing = raw ? JSON.parse(raw) : {};
      localStorage.setItem("offerbell_onboarding_profile", JSON.stringify({ ...existing, plan: "pro", planActivatedAt: now }));
      localStorage.setItem("offerbell_plan", "pro");
      localStorage.setItem("offerbell_plan_activated_at", String(now));
    } catch {}

    // Persist to database
    try {
      const userId = localStorage.getItem("offerbell_user_id");
      const promo = localStorage.getItem("offerbell_promo_code") || undefined;
      if (userId && upgradePlan) {
        upgradePlan({ userId, promoCode: promo }).catch(() => {});
      }
    } catch {}

    // Redirect to dashboard after 3 seconds
    const timer = setTimeout(() => router.push("/dashboard"), 3000);
    return () => clearTimeout(timer);
  }, [router, upgradePlan]);

  return (
    <div style={{ minHeight: "100vh", display: "flex", animation: "successIn 0.5s ease both", alignItems: "center", justifyContent: "center", background: "#fafaf9", fontFamily: "'Sora', sans-serif" }}>
      <div style={{ textAlign: "center", maxWidth: 440, padding: 24 }}>
        <div style={{ width: 64, height: 64, borderRadius: "50%", background: "#16a34a", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 20px" }}>
          <svg width="28" height="28" fill="none" stroke="#fff" strokeWidth="2.5" viewBox="0 0 24 24"><polyline points="20 6 9 17 4 12"/></svg>
        </div>
        <div style={{ fontFamily: "'Instrument Serif', serif", fontSize: 32, letterSpacing: "-.5px", marginBottom: 8 }}>Welcome to <em style={{ fontStyle: "italic" }}>Pro</em></div>
        <div style={{ fontSize: 14, color: "#636160", lineHeight: 1.7, marginBottom: 24 }}>Your subscription is active. You now have unlimited access to everything OfferBell has to offer.</div>
        <div style={{ fontSize: 13, color: "#9b9997" }}>Redirecting to your dashboard...</div>
      </div>
    </div>
  );
}
