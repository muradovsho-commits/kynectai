"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import "../contact-finder/contact-finder.css";
import { getUserPlan } from "../lib/plan";
import type { PlanTier } from "../lib/plan";

const CHECK = <svg width="14" height="14" fill="none" stroke="#16a34a" strokeWidth="2.5" viewBox="0 0 24 24" style={{flexShrink:0}}><polyline points="20 6 9 17 4 12"/></svg>;
const DASH = <svg width="14" height="14" fill="none" stroke="var(--border-2)" strokeWidth="2" viewBox="0 0 24 24" style={{flexShrink:0}}><line x1="5" y1="12" x2="19" y2="12"/></svg>;
const LIMIT = (t: string) => <span style={{fontSize:11,fontWeight:700,color:'var(--text-3)',flexShrink:0}}>{t}</span>;

type Feature = { label: string; free: React.ReactNode; pro: React.ReactNode; elite: React.ReactNode };

const FEATURES: Feature[] = [
  { label: 'Interview Flashcards', free: LIMIT('10% per track'), pro: CHECK, elite: CHECK },
  { label: 'Concept Drills', free: LIMIT('5 Qs/drill'), pro: CHECK, elite: CHECK },
  { label: 'Diagnostic Review', free: LIMIT('1 track'), pro: CHECK, elite: CHECK },
  { label: 'Interview Prep Guides', free: DASH, pro: CHECK, elite: CHECK },
  { label: 'Flashcard Bookmarks', free: CHECK, pro: CHECK, elite: CHECK },
  { label: 'Cross-device Sync', free: CHECK, pro: CHECK, elite: CHECK },
  { label: 'Activity Streak & Calendar', free: CHECK, pro: CHECK, elite: CHECK },
  { label: 'Outreach Tracker', free: LIMIT('5 contacts'), pro: CHECK, elite: CHECK },
  { label: 'Referral Map', free: LIMIT('3 contacts'), pro: CHECK, elite: CHECK },
  { label: 'Outreach Writer', free: LIMIT('5 total'), pro: LIMIT('20/week'), elite: LIMIT('30/week') },
  { label: 'AI Resume Review', free: LIMIT('1 total'), pro: LIMIT('10/week'), elite: LIMIT('30/week') },
  { label: 'AI Coach', free: LIMIT('1 message'), pro: LIMIT('Usage-based'), elite: LIMIT('Higher limits') },
  { label: 'Mock Interview', free: DASH, pro: LIMIT('Usage-based'), elite: LIMIT('Higher limits') },
  { label: 'Contact Finder', free: DASH, pro: CHECK, elite: CHECK },
  { label: 'Priority Support', free: DASH, pro: DASH, elite: CHECK },
  { label: 'Early Feature Access', free: DASH, pro: DASH, elite: CHECK },
];

export default function CheckoutPage() {
  const router = useRouter();
  const [loading, setLoading] = useState<string | null>(null);
  const [email, setEmail] = useState("");
  const [currentPlan, setCurrentPlan] = useState<PlanTier>('free');
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'annual'>('monthly');
  const [currentCycle, setCurrentCycle] = useState<string | null>(null);

  useEffect(() => {
    const theme = localStorage.getItem("offerbell-theme");
    if (theme === "dark") document.documentElement.setAttribute("data-theme", "dark");
    setCurrentPlan(getUserPlan());
    const cycle = localStorage.getItem("offerbell_billing_cycle");
    if (cycle) { setCurrentCycle(cycle); setBillingCycle(cycle as any); }
    try {
      const raw = localStorage.getItem("offerbell_onboarding_profile");
      if (raw) { const p = JSON.parse(raw); setEmail(p.email || ""); }
    } catch {}
  }, []);

  const handleCheckout = async (plan: 'pro' | 'elite') => {
    setLoading(plan);
    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, plan, billing: billingCycle }),
      });
      const data = await res.json();
      if (data.url) {
        localStorage.setItem("offerbell_billing_cycle", billingCycle);
        localStorage.setItem("offerbell_checkout_plan", plan);
        window.location.href = data.url;
      } else { setLoading(null); alert("Something went wrong. Please try again."); }
    } catch { setLoading(null); alert("Something went wrong. Please try again."); }
  };

  const PRO_M = 20, PRO_A = 199, ELITE_M = 40, ELITE_A = 399;
  const proPrice = billingCycle === 'annual' ? PRO_A : PRO_M;
  const elitePrice = billingCycle === 'annual' ? ELITE_A : ELITE_M;
  const proMonthly = billingCycle === 'annual' ? (PRO_A / 12).toFixed(0) : PRO_M;
  const eliteMonthly = billingCycle === 'annual' ? (ELITE_A / 12).toFixed(0) : ELITE_M;

  // Already subscribed
  if (currentPlan !== 'free') {
    const planLabel = currentPlan === 'elite' ? 'Elite' : 'Pro';
    return (
      <div style={{ minHeight: '100vh', background: 'var(--bg)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24 }}>
        <div style={{ width: '100%', maxWidth: 480, background: 'var(--surface)', border: '1.5px solid var(--border)', borderRadius: 20, padding: '40px 32px', textAlign: 'center' }}>
          <div style={{ width: 56, height: 56, borderRadius: '50%', background: '#ecfdf5', color: '#10b981', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px', fontSize: 24 }}>✓</div>
          <div style={{ fontFamily: "'Instrument Serif', serif", fontSize: 28, color: 'var(--text)', marginBottom: 8 }}>You&apos;re on <em>{planLabel}</em></div>
          <div style={{ fontSize: 14, color: 'var(--text-3)', marginBottom: 32, lineHeight: 1.6 }}>You have full access to all OfferBell {planLabel} features.</div>
          <div style={{ background: 'var(--bg)', border: '1px solid var(--border)', borderRadius: 12, padding: 20, marginBottom: 24, textAlign: 'left' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 12 }}><span style={{ fontSize: 13, color: 'var(--text-3)' }}>Plan</span><span style={{ fontSize: 13, fontWeight: 700, color: 'var(--text)' }}>OfferBell {planLabel}</span></div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 12 }}><span style={{ fontSize: 13, color: 'var(--text-3)' }}>Billing</span><span style={{ fontSize: 13, fontWeight: 700, color: 'var(--text)' }}>{currentCycle === 'annual' ? 'Annual' : 'Monthly'}</span></div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}><span style={{ fontSize: 13, color: 'var(--text-3)' }}>Status</span><span style={{ fontSize: 13, fontWeight: 700, color: '#16a34a' }}>Active</span></div>
          </div>
          {currentPlan === 'pro' && (
            <button onClick={() => handleCheckout('elite')} disabled={!!loading} type="button" style={{ width: '100%', padding: '14px 0', background: 'linear-gradient(135deg, #7c3aed, #6366f1)', color: '#fff', borderRadius: 12, border: 'none', fontSize: 14, fontWeight: 700, cursor: 'pointer', fontFamily: "'Sora', sans-serif", marginBottom: 12, opacity: loading ? 0.6 : 1 }}>
              {loading ? 'Redirecting...' : 'Upgrade to Elite'}
            </button>
          )}
          <div style={{ fontSize: 12, color: 'var(--text-3)', marginBottom: 24, lineHeight: 1.6 }}>To cancel or update payment, contact officialofferbell@gmail.com.</div>
          <button onClick={() => router.push("/dashboard")} type="button" style={{ width: '100%', padding: '14px 0', background: 'var(--text)', color: 'var(--surface)', borderRadius: 12, border: 'none', fontSize: 14, fontWeight: 700, cursor: 'pointer', fontFamily: "'Sora', sans-serif" }}>Back to Dashboard</button>
        </div>
      </div>
    );
  }

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg)', padding: '40px 24px', animation: 'checkoutIn 0.4s ease both' }}>
      <div style={{ maxWidth: 1100, margin: '0 auto' }}>
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: 36 }}>
          <div style={{ fontFamily: "'Instrument Serif', serif", fontSize: 36, color: 'var(--text)', letterSpacing: '-0.8px', marginBottom: 6 }}>Choose your <em style={{ fontStyle: 'italic' }}>plan</em></div>
          <div style={{ fontSize: 14, color: 'var(--text-3)', marginBottom: 20 }}>Start free. Upgrade when you&apos;re ready to get serious about recruiting.</div>

          {/* Billing toggle */}
          <div style={{ display: 'inline-flex', gap: 4, background: 'var(--surface)', border: '1.5px solid var(--border)', borderRadius: 100, padding: 4 }}>
            <button onClick={() => setBillingCycle('monthly')} type="button" style={{ padding: '8px 20px', borderRadius: 100, border: 'none', background: billingCycle === 'monthly' ? 'var(--text)' : 'transparent', color: billingCycle === 'monthly' ? 'var(--surface)' : 'var(--text-3)', fontSize: 13, fontWeight: 600, cursor: 'pointer', fontFamily: "'Sora', sans-serif" }}>Monthly</button>
            <button onClick={() => setBillingCycle('annual')} type="button" style={{ padding: '8px 20px', borderRadius: 100, border: 'none', background: billingCycle === 'annual' ? 'var(--text)' : 'transparent', color: billingCycle === 'annual' ? 'var(--surface)' : 'var(--text-3)', fontSize: 13, fontWeight: 600, cursor: 'pointer', fontFamily: "'Sora', sans-serif", display: 'flex', alignItems: 'center', gap: 6 }}>
              Annual
              <span style={{ fontSize: 9, fontWeight: 800, background: '#16a34a', color: '#fff', padding: '2px 6px', borderRadius: 4 }}>SAVE 17%</span>
            </button>
          </div>
        </div>

        {/* Plan cards */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16, marginBottom: 48 }}>
          {/* FREE */}
          <div style={{ background: 'var(--surface)', border: '1.5px solid var(--border)', borderRadius: 16, padding: '28px 24px', display: 'flex', flexDirection: 'column' }}>
            <div style={{ fontSize: 12, fontWeight: 700, letterSpacing: '1.5px', textTransform: 'uppercase', color: 'var(--text-3)', marginBottom: 10 }}>Free</div>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: 4, marginBottom: 4 }}>
              <span style={{ fontFamily: "'Instrument Serif', serif", fontSize: 40, color: 'var(--text)', letterSpacing: '-1px' }}>$0</span>
            </div>
            <div style={{ fontSize: 12, color: 'var(--text-3)', marginBottom: 20 }}>Get started with the basics</div>
            <button onClick={() => { localStorage.setItem('offerbell_plan', 'free'); try { const p = JSON.parse(localStorage.getItem('offerbell_onboarding_profile') || '{}'); p.plan = 'free'; localStorage.setItem('offerbell_onboarding_profile', JSON.stringify(p)); } catch {} router.push('/dashboard'); }} type="button" style={{ width: '100%', padding: '12px 0', borderRadius: 10, border: '1.5px solid var(--border)', background: 'var(--surface)', color: 'var(--text)', fontSize: 13, fontWeight: 700, cursor: 'pointer', fontFamily: "'Sora', sans-serif", marginBottom: 20 }}>Continue Free</button>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10, flex: 1 }}>
              {['10% of flashcards per track', '5 questions per drill', '1 diagnostic track', 'Flashcard bookmarks', 'Cross-device sync', 'Activity streak', '5 outreach contacts', '3 referral contacts', '5 outreach emails total', '1 resume review', '1 coach message'].map(f => (
                <div key={f} style={{ display: 'flex', gap: 8, alignItems: 'center', fontSize: 12, color: 'var(--text-2)' }}>{CHECK}{f}</div>
              ))}
            </div>
          </div>

          {/* PRO */}
          <div style={{ background: 'var(--surface)', border: '2px solid var(--text)', borderRadius: 16, padding: '28px 24px', display: 'flex', flexDirection: 'column', position: 'relative' }}>
            <div style={{ position: 'absolute', top: -12, left: '50%', transform: 'translateX(-50%)', background: 'var(--text)', color: 'var(--surface)', fontSize: 10, fontWeight: 800, padding: '4px 14px', borderRadius: 100, letterSpacing: '1px', textTransform: 'uppercase' }}>Most Popular</div>
            <div style={{ fontSize: 12, fontWeight: 700, letterSpacing: '1.5px', textTransform: 'uppercase', color: 'var(--text)', marginBottom: 10 }}>Pro</div>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: 4, marginBottom: 4 }}>
              <span style={{ fontFamily: "'Instrument Serif', serif", fontSize: 40, color: 'var(--text)', letterSpacing: '-1px' }}>${proMonthly}</span>
              <span style={{ fontSize: 13, color: 'var(--text-3)' }}>/mo</span>
            </div>
            <div style={{ fontSize: 12, color: 'var(--text-3)', marginBottom: 20 }}>{billingCycle === 'annual' ? `$${PRO_A} billed annually` : 'Billed monthly. Cancel anytime.'}</div>
            <button onClick={() => handleCheckout('pro')} disabled={!!loading} type="button" style={{ width: '100%', padding: '12px 0', borderRadius: 10, border: 'none', background: 'var(--text)', color: 'var(--surface)', fontSize: 13, fontWeight: 700, cursor: 'pointer', fontFamily: "'Sora', sans-serif", marginBottom: 20, opacity: loading === 'pro' ? 0.6 : 1 }}>{loading === 'pro' ? 'Redirecting...' : 'Get Pro'}</button>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10, flex: 1 }}>
              {['Full flashcard access — all tracks', 'Unlimited concept drills', 'All diagnostic tracks', 'Interview prep guides', 'AI Coach (usage-based)', 'Mock Interview (usage-based)', 'Resume Review (10/week)', 'Outreach Writer (20/week)', 'Unlimited outreach contacts', 'Unlimited referral map', 'Contact Finder'].map(f => (
                <div key={f} style={{ display: 'flex', gap: 8, alignItems: 'center', fontSize: 12, color: 'var(--text-2)' }}>{CHECK}{f}</div>
              ))}
            </div>
          </div>

          {/* ELITE */}
          <div style={{ background: 'linear-gradient(180deg, rgba(124,58,237,0.04), transparent)', border: '1.5px solid rgba(124,58,237,0.3)', borderRadius: 16, padding: '28px 24px', display: 'flex', flexDirection: 'column' }}>
            <div style={{ fontSize: 12, fontWeight: 700, letterSpacing: '1.5px', textTransform: 'uppercase', color: '#7c3aed', marginBottom: 10 }}>Elite</div>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: 4, marginBottom: 4 }}>
              <span style={{ fontFamily: "'Instrument Serif', serif", fontSize: 40, color: 'var(--text)', letterSpacing: '-1px' }}>${eliteMonthly}</span>
              <span style={{ fontSize: 13, color: 'var(--text-3)' }}>/mo</span>
            </div>
            <div style={{ fontSize: 12, color: 'var(--text-3)', marginBottom: 20 }}>{billingCycle === 'annual' ? `$${ELITE_A} billed annually` : 'Billed monthly. Cancel anytime.'}</div>
            <button onClick={() => handleCheckout('elite')} disabled={!!loading} type="button" style={{ width: '100%', padding: '12px 0', borderRadius: 10, border: 'none', background: 'linear-gradient(135deg, #7c3aed, #6366f1)', color: '#fff', fontSize: 13, fontWeight: 700, cursor: 'pointer', fontFamily: "'Sora', sans-serif", marginBottom: 20, opacity: loading === 'elite' ? 0.6 : 1 }}>{loading === 'elite' ? 'Redirecting...' : 'Get Elite'}</button>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10, flex: 1 }}>
              {['Everything in Pro, plus:', 'AI Coach (higher limits)', 'Mock Interview (higher limits)', 'Resume Review (30/week)', 'Outreach Writer (30/week)', 'Priority support', 'Early feature access'].map((f, i) => (
                <div key={f} style={{ display: 'flex', gap: 8, alignItems: 'center', fontSize: 12, color: i === 0 ? 'var(--text)' : 'var(--text-2)', fontWeight: i === 0 ? 700 : 400 }}>{i === 0 ? null : CHECK}{f}</div>
              ))}
            </div>
          </div>
        </div>

        {/* Feature comparison table */}
        <div style={{ background: 'var(--surface)', border: '1.5px solid var(--border)', borderRadius: 16, overflow: 'hidden', maxWidth: 900, margin: '0 auto' }}>
          <div style={{ padding: '20px 24px', borderBottom: '2px solid var(--text)' }}>
            <div style={{ fontFamily: "'Instrument Serif', serif", fontSize: 22, color: 'var(--text)', letterSpacing: '-0.3px' }}>Compare <em style={{ fontStyle: 'italic' }}>plans</em></div>
          </div>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid var(--border)' }}>
                <th style={{ padding: '14px 24px', textAlign: 'left', fontSize: 12, fontWeight: 700, color: 'var(--text-3)', textTransform: 'uppercase', letterSpacing: '1px' }}>Feature</th>
                <th style={{ padding: '14px 20px', textAlign: 'center', fontSize: 12, fontWeight: 700, color: 'var(--text-3)', textTransform: 'uppercase', letterSpacing: '1px', width: 120 }}>Free</th>
                <th style={{ padding: '14px 20px', textAlign: 'center', fontSize: 12, fontWeight: 700, color: 'var(--text)', textTransform: 'uppercase', letterSpacing: '1px', width: 120 }}>Pro</th>
                <th style={{ padding: '14px 20px', textAlign: 'center', fontSize: 12, fontWeight: 700, color: '#7c3aed', textTransform: 'uppercase', letterSpacing: '1px', width: 120 }}>Elite</th>
              </tr>
            </thead>
            <tbody>
              {FEATURES.map((f, i) => (
                <tr key={f.label} style={{ borderBottom: i < FEATURES.length - 1 ? '1px solid var(--border)' : 'none' }}>
                  <td style={{ padding: '12px 24px', fontSize: 13, color: 'var(--text)', fontWeight: 500 }}>{f.label}</td>
                  <td style={{ padding: '12px 20px', textAlign: 'center' }}>{f.free}</td>
                  <td style={{ padding: '12px 20px', textAlign: 'center' }}>{f.pro}</td>
                  <td style={{ padding: '12px 20px', textAlign: 'center' }}>{f.elite}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Footer */}
        <div style={{ textAlign: 'center', marginTop: 32, fontSize: 12, color: 'var(--text-3)', lineHeight: 1.6 }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, marginBottom: 8 }}>
            <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24"><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
            Secure checkout powered by Stripe. Cancel anytime.
          </div>
          By subscribing you agree to our Terms of Service.
        </div>
      </div>
      <style>{`@keyframes checkoutIn { from { opacity: 0; transform: translateY(12px); } to { opacity: 1; transform: none; } }`}</style>
    </div>
  );
}
