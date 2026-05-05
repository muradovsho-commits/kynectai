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
    const params = new URLSearchParams(window.location.search);
    const planTier = params.get('plan') || localStorage.getItem('offerbell_checkout_plan') || 'pro';
    const billingType = params.get('billing') || localStorage.getItem('offerbell_billing_cycle') || 'monthly';
    
    // Save plan to localStorage
    try {
      const raw = localStorage.getItem("offerbell_onboarding_profile");
      const existing = raw ? JSON.parse(raw) : {};
      localStorage.setItem("offerbell_onboarding_profile", JSON.stringify({ ...existing, plan: planTier, planActivatedAt: now, billingCycle: billingType }));
      localStorage.setItem("offerbell_plan", planTier);
      localStorage.setItem("offerbell_plan_activated_at", String(now));
      localStorage.setItem("offerbell_billing_cycle", billingType);
      localStorage.removeItem("offerbell_checkout_plan");
    } catch {}

    // Persist to database
    try {
      const userId = localStorage.getItem("offerbell_user_id");
      const promo = localStorage.getItem("offerbell_promo_code") || undefined;
      if (userId && upgradePlan) {
        upgradePlan({ userId, promoCode: promo, plan: planTier }).catch(() => {});
      }
    } catch {}

    const timer = setTimeout(() => router.push("/dashboard"), 3000);
    return () => clearTimeout(timer);
  }, [router, upgradePlan]);

  const params = typeof window !== 'undefined' ? new URLSearchParams(window.location.search) : null;
  const planName = (params?.get('plan') || 'pro') === 'elite' ? 'Elite' : 'Pro';

  return (
    <div style={{ minHeight: "100vh", display: "flex", animation: "successIn 0.5s ease both", alignItems: "center", justifyContent: "center", background: "#fafaf9", fontFamily: "'Sora', sans-serif" }}>
      <div style={{ textAlign: "center", maxWidth: 440, padding: 24 }}>
        <div style={{ width: 64, height: 64, borderRadius: "50%", background: planName === 'Elite' ? '#2563eb' : "#16a34a", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 20px" }}>
          <svg width="28" height="28" fill="none" stroke="#fff" strokeWidth="2.5" viewBox="0 0 24 24"><polyline points="20 6 9 17 4 12"/></svg>
        </div>
        <div style={{ fontFamily: "'Instrument Serif', serif", fontSize: 32, letterSpacing: "-.5px", marginBottom: 8 }}>Welcome to <em style={{ fontStyle: "italic" }}>{planName}</em></div>
        <div style={{ fontSize: 14, color: "#636160", lineHeight: 1.7, marginBottom: 24 }}>Your subscription is active. You now have full access to all OfferBell {planName} features.</div>
        <div style={{ fontSize: 13, color: "#9b9997" }}>Redirecting to your dashboard...</div>
      </div>
    </div>
  );
}
