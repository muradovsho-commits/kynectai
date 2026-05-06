"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";
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
  { label: 'Career Guides / Quiz', free: CHECK, pro: CHECK, elite: CHECK },
  { label: 'Interview Prep Guides', free: DASH, pro: CHECK, elite: CHECK },
  { label: 'Flashcard Bookmarks', free: CHECK, pro: CHECK, elite: CHECK },
  { label: 'Cross-device Sync', free: CHECK, pro: CHECK, elite: CHECK },
  { label: 'Activity Streak & Calendar', free: CHECK, pro: CHECK, elite: CHECK },
  { label: 'Outreach Tracker', free: LIMIT('5 contacts'), pro: CHECK, elite: CHECK },
  { label: 'Referral Map', free: LIMIT('5 contacts'), pro: CHECK, elite: CHECK },
  { label: 'Outreach Writer', free: LIMIT('5 total'), pro: LIMIT('20/week'), elite: LIMIT('30/week') },
  { label: 'AI Resume Review', free: LIMIT('1/week'), pro: LIMIT('10/week'), elite: LIMIT('30/week') },
  { label: 'AI Coach', free: LIMIT('1/week'), pro: LIMIT('Usage-based'), elite: LIMIT('Higher limits') },
  { label: 'Mock Interview', free: LIMIT('3/week'), pro: CHECK, elite: CHECK },
  { label: 'Priority Support', free: DASH, pro: DASH, elite: CHECK },
  { label: 'Early Feature Access', free: DASH, pro: DASH, elite: CHECK },
];

// Pricing
// Monthly base: Pro $20, Elite $40
// 6-month: 10% off -> Pro $108 ($18/mo), Elite $216 ($36/mo)
// Annual: 20% off -> Pro $192 ($16/mo), Elite $384 ($32/mo)
type BillingCycle = 'monthly' | '6month' | 'annual';

const PRICING = {
  pro:   { monthly: 20,  sixMonth: 108, annual: 192 },
  elite: { monthly: 40,  sixMonth: 216, annual: 384 },
};

function monthlyEquiv(plan: 'pro' | 'elite', cycle: BillingCycle): number {
  if (cycle === 'monthly') return PRICING[plan].monthly;
  if (cycle === '6month') return Math.round(PRICING[plan].sixMonth / 6);
  return Math.round(PRICING[plan].annual / 12);
}

function totalPrice(plan: 'pro' | 'elite', cycle: BillingCycle): number {
  if (cycle === 'monthly') return PRICING[plan].monthly;
  if (cycle === '6month') return PRICING[plan].sixMonth;
  return PRICING[plan].annual;
}

function billingLabel(cycle: BillingCycle): string {
  if (cycle === 'monthly') return 'Billed monthly. Cancel anytime.';
  if (cycle === '6month') return `Billed every 6 months. Save 10%.`;
  return `Billed annually. Save 20%.`;
}

// City images (Unsplash - free to use)
const IMG_FREE = 'https://images.unsplash.com/photo-1562774053-701939374585?w=600&h=300&fit=crop&crop=center'; // college campus
const IMG_PRO = 'https://images.unsplash.com/photo-1477959858617-67f85cf4f1df?w=600&h=300&fit=crop&crop=center'; // chicago skyline
const IMG_ELITE = 'https://images.unsplash.com/photo-1534430480872-3498386e7856?w=600&h=300&fit=crop&crop=center'; // new york skyline

export default function CheckoutPage() {
  const router = useRouter();
  const [loading, setLoading] = useState<string | null>(null);
  const [email, setEmail] = useState("");
  const [currentPlan, setCurrentPlan] = useState<PlanTier>('free');
  const [billingCycle, setBillingCycle] = useState<BillingCycle>('monthly');
  const [currentCycle, setCurrentCycle] = useState<string | null>(null);
  const downgradePlan = useMutation((api as any).auth?.downgradePlan);
  const changePlan = useMutation((api as any).auth?.upgradePlan);

  useEffect(() => {
    const theme = localStorage.getItem("offerbell-theme");
    if (theme === "dark") document.documentElement.setAttribute("data-theme", "dark");
    setCurrentPlan(getUserPlan());
    const cycle = localStorage.getItem("offerbell_billing_cycle");
    if (cycle) { setCurrentCycle(cycle); setBillingCycle(cycle as BillingCycle); }
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
       body: JSON.stringify({ email, plan, billing: billingCycle, userId: localStorage.getItem('offerbell_user_id') || '' }),
      });
      const data = await res.json();
      if (data.url) {
        localStorage.setItem("offerbell_billing_cycle", billingCycle);
        localStorage.setItem("offerbell_checkout_plan", plan);
        window.location.href = data.url;
      } else { setLoading(null); alert("Something went wrong. Please try again."); }
    } catch { setLoading(null); alert("Something went wrong. Please try again."); }
  };

  const handleDowngrade = async () => {
    if (!confirm('Cancel your subscription and switch to Free? You will keep access until the end of your current billing period.')) return;
    setLoading('downgrade');
    const userId = localStorage.getItem('offerbell_user_id');
    if (userId && downgradePlan) {
      try { await downgradePlan({ userId }); } catch {}
    }
    localStorage.setItem('offerbell_plan', 'free');
    try { const p = JSON.parse(localStorage.getItem('offerbell_onboarding_profile') || '{}'); p.plan = 'free'; localStorage.setItem('offerbell_onboarding_profile', JSON.stringify(p)); } catch {}
    localStorage.removeItem('offerbell_plan_activated_at');
    localStorage.removeItem('offerbell_billing_cycle');
    window.location.href = '/dashboard';
  };

  const handleSwitch = async (from: string, to: 'pro' | 'elite') => {
    if (from === to) return;
    // Downgrading from elite to pro
    if (from === 'elite' && to === 'pro') {
      if (!confirm('Switch to Pro? The change takes effect at your next billing cycle. You will keep Elite access until then.')) return;
      setLoading('switch');
      const userId = localStorage.getItem('offerbell_user_id');
      if (userId && changePlan) {
        try { await changePlan({ userId, plan: 'pro' }); } catch {}
      }
      localStorage.setItem('offerbell_plan', 'pro');
      try { const p = JSON.parse(localStorage.getItem('offerbell_onboarding_profile') || '{}'); p.plan = 'pro'; localStorage.setItem('offerbell_onboarding_profile', JSON.stringify(p)); } catch {}
      window.location.href = '/dashboard';
      return;
    }
    // Upgrading
    handleCheckout(to);
  };

  const cycles: { key: BillingCycle; label: string; badge?: string }[] = [
    { key: 'monthly', label: 'Monthly' },
    { key: '6month', label: '6 Months', badge: 'Save 10%' },
    { key: 'annual', label: 'Yearly', badge: 'Save 20%' },
  ];

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg)', padding: '40px 24px 80px', animation: 'checkoutIn 0.4s ease both' }}>
      <div style={{ maxWidth: 1120, margin: '0 auto' }}>

        {/* Back button */}
        <div style={{ marginBottom: 24 }}>
          <button onClick={() => router.push('/my-account')} type="button" style={{ display: 'inline-flex', alignItems: 'center', gap: 6, background: 'none', border: 'none', color: 'var(--text-3)', fontSize: 12, fontWeight: 600, cursor: 'pointer', fontFamily: "'Sora', sans-serif" }}>
            <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M19 12H5M12 19l-7-7 7-7"/></svg>
            Back to Settings
          </button>
        </div>

        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: 36 }}>
          <h1 style={{ fontFamily: "'Instrument Serif', serif", fontSize: 36, letterSpacing: '-1px', color: 'var(--text)', marginBottom: 8 }}>
            Choose Your Path to an <em style={{ fontStyle: 'italic' }}>Offer</em>
          </h1>
          <p style={{ fontSize: 14, color: 'var(--text-3)', marginBottom: 24 }}>
            Pick the plan that matches your timeline and ambition. Cancel anytime.
          </p>

          {/* Billing cycle toggle */}
          <div style={{ display: 'inline-flex', alignItems: 'center', background: 'var(--surface)', border: '1.5px solid var(--border)', borderRadius: 100, padding: 4, gap: 4 }}>
            {cycles.map(c => (
              <button
                key={c.key}
                onClick={() => setBillingCycle(c.key)}
                type="button"
                style={{
                  display: 'inline-flex', alignItems: 'center', gap: 6,
                  padding: '8px 18px', borderRadius: 100, border: 'none',
                  background: billingCycle === c.key ? 'var(--text)' : 'transparent',
                  color: billingCycle === c.key ? 'var(--surface)' : 'var(--text-2)',
                  fontSize: 13, fontWeight: 600, cursor: 'pointer',
                  fontFamily: "'Sora', sans-serif", transition: 'all 0.15s',
                }}
              >
                {c.label}
                {c.badge && (
                  <span style={{
                    fontSize: 9, fontWeight: 800, letterSpacing: '0.5px',
                    padding: '2px 8px', borderRadius: 100,
                    background: billingCycle === c.key ? 'var(--surface)' : 'var(--text)',
                    color: billingCycle === c.key ? 'var(--text)' : 'var(--surface)',
                  }}>{c.badge}</span>
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Plan cards */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 20, marginBottom: 48 }}>

          {/* FREE */}
          <div style={{
            background: 'var(--surface)', border: '1.5px solid var(--border)', borderRadius: 16,
            overflow: 'hidden', display: 'flex', flexDirection: 'column',
          }}>
            <div style={{ height: 160, overflow: 'hidden', position: 'relative' }}>
              <img src={IMG_FREE} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block', filter: 'brightness(0.85)' }} />
              {currentPlan === 'free' && (
                <div style={{ position: 'absolute', top: 12, right: 12, background: 'var(--text)', color: 'var(--surface)', fontSize: 9, fontWeight: 800, padding: '4px 10px', borderRadius: 6, letterSpacing: '0.5px', textTransform: 'uppercase' }}>Your Tier</div>
              )}
            </div>
            <div style={{ padding: '24px 24px 28px', flex: 1, display: 'flex', flexDirection: 'column' }}>
              <div style={{ fontSize: 18, fontWeight: 700, color: 'var(--text)', marginBottom: 8 }}>Basic</div>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: 4, marginBottom: 4 }}>
                <span style={{ fontFamily: "'Instrument Serif', serif", fontSize: 38, color: 'var(--text)', letterSpacing: '-1px' }}>$0</span>
                <span style={{ fontSize: 13, color: 'var(--text-3)' }}>free</span>
              </div>
              <p style={{ fontSize: 13, color: 'var(--text-3)', marginBottom: 20, lineHeight: 1.5 }}>
                Technicals practice only. Fundamental questions. Basic functionality.
              </p>

              <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--text)', marginBottom: 12 }}>Includes</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10, flex: 1 }}>
                {[
                  { icon: CHECK, text: '10% of flashcards per track' },
                  { icon: DASH, text: 'No access to Premium Collections' },
                  { icon: DASH, text: 'Filter to single collection & topic' },
                  { icon: DASH, text: 'Save up to 5 questions' },
                  { icon: CHECK, text: '1 diagnostic review' },
                  { icon: CHECK, text: 'Activity streak tracking' },
                ].map((f, i) => (
                  <div key={i} style={{ display: 'flex', gap: 8, alignItems: 'flex-start', fontSize: 12, color: 'var(--text-2)', lineHeight: 1.5 }}>{f.icon}<span>{f.text}</span></div>
                ))}
              </div>

              {currentPlan !== 'free' && (
                <button onClick={handleDowngrade} type="button" style={{
                  width: '100%', padding: '12px 0', borderRadius: 10, marginTop: 20,
                  border: '1.5px solid var(--border)', background: 'var(--surface)',
                  color: 'var(--text-2)', fontSize: 13, fontWeight: 700, cursor: 'pointer',
                  fontFamily: "'Sora', sans-serif",
                }}>Downgrade to Basic</button>
              )}
            </div>
          </div>

          {/* PRO */}
          <div style={{
            background: 'var(--surface)', border: '2px solid var(--text)', borderRadius: 16,
            overflow: 'hidden', display: 'flex', flexDirection: 'column', position: 'relative',
          }}>
            <div style={{ height: 160, overflow: 'hidden', position: 'relative' }}>
              <img src={IMG_PRO} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
              <div style={{ position: 'absolute', top: 12, right: 12, background: '#16a34a', color: '#fff', fontSize: 9, fontWeight: 800, padding: '4px 10px', borderRadius: 6, letterSpacing: '0.5px', textTransform: 'uppercase' }}>Popular</div>
            </div>
            <div style={{ padding: '24px 24px 28px', flex: 1, display: 'flex', flexDirection: 'column' }}>
              <div style={{ fontSize: 18, fontWeight: 700, color: 'var(--text)', marginBottom: 8 }}>Pro</div>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: 4, marginBottom: 4 }}>
                <span style={{ fontFamily: "'Instrument Serif', serif", fontSize: 38, color: 'var(--text)', letterSpacing: '-1px' }}>${monthlyEquiv('pro', billingCycle)}</span>
                <span style={{ fontSize: 13, color: 'var(--text-3)' }}>monthly</span>
              </div>
              <p style={{ fontSize: 13, color: 'var(--text-3)', marginBottom: 20, lineHeight: 1.5 }}>
                {billingLabel(billingCycle)}
                {billingCycle !== 'monthly' && <><br /><span style={{ fontWeight: 600, color: 'var(--text-2)' }}>${totalPrice('pro', billingCycle)} total</span></>}
              </p>

              <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--text)', marginBottom: 12 }}>Everything in Basic, plus</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10, flex: 1 }}>
                {[
                  'Full flashcard access - all tracks',
                  'Unlimited concept drills',
                  'All diagnostic tracks',
                  'Interview prep guides',
                  'AI Coach (usage-based)',
                  'Unlimited Mock Interviews',
                  'Resume Review (10/week)',
                  'Outreach Writer (20/week)',
                  'Unlimited outreach contacts',
                ].map(f => (
                  <div key={f} style={{ display: 'flex', gap: 8, alignItems: 'center', fontSize: 12, color: 'var(--text-2)' }}>{CHECK}<span>{f}</span></div>
                ))}
              </div>

              <button
                onClick={() => { if (currentPlan === 'pro') return; handleSwitch(currentPlan, 'pro'); }}
                disabled={currentPlan === 'pro' || !!loading}
                type="button"
                style={{
                  width: '100%', padding: '12px 0', borderRadius: 10, marginTop: 20, border: 'none',
                  background: currentPlan === 'pro' ? 'var(--surface-2)' : 'var(--text)',
                  color: currentPlan === 'pro' ? 'var(--text-3)' : 'var(--surface)',
                  fontSize: 13, fontWeight: 700,
                  cursor: currentPlan === 'pro' ? 'default' : 'pointer',
                  fontFamily: "'Sora', sans-serif",
                  opacity: loading === 'pro' ? 0.6 : 1,
                }}
              >
                {currentPlan === 'pro' ? 'Current Plan' : currentPlan === 'elite' ? 'Switch to Pro' : loading === 'pro' ? 'Redirecting...' : 'Upgrade to Pro'}
              </button>
            </div>
          </div>

          {/* ELITE */}
          <div style={{
            background: 'var(--surface)', border: '1.5px solid rgba(37,99,235,0.35)', borderRadius: 16,
            overflow: 'hidden', display: 'flex', flexDirection: 'column',
          }}>
            <div style={{ height: 160, overflow: 'hidden', position: 'relative' }}>
              <img src={IMG_ELITE} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
              <div style={{ position: 'absolute', top: 12, right: 12, background: '#2563eb', color: '#fff', fontSize: 9, fontWeight: 800, padding: '4px 10px', borderRadius: 6, letterSpacing: '0.5px', textTransform: 'uppercase' }}>Best Value</div>
            </div>
            <div style={{ padding: '24px 24px 28px', flex: 1, display: 'flex', flexDirection: 'column' }}>
              <div style={{ fontSize: 18, fontWeight: 700, color: 'var(--text)', marginBottom: 8 }}>Elite</div>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: 4, marginBottom: 4 }}>
                <span style={{ fontFamily: "'Instrument Serif', serif", fontSize: 38, color: 'var(--text)', letterSpacing: '-1px' }}>${monthlyEquiv('elite', billingCycle)}</span>
                <span style={{ fontSize: 13, color: 'var(--text-3)' }}>monthly</span>
              </div>
              <p style={{ fontSize: 13, color: 'var(--text-3)', marginBottom: 20, lineHeight: 1.5 }}>
                {billingLabel(billingCycle)}
                {billingCycle !== 'monthly' && <><br /><span style={{ fontWeight: 600, color: 'var(--text-2)' }}>${totalPrice('elite', billingCycle)} total</span></>}
              </p>

              <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--text)', marginBottom: 12 }}>Everything in Pro, plus</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10, flex: 1 }}>
                {[
                  'AI Coach (higher limits)',
                  'Mock Interview (higher limits)',
                  'Resume Review (30/week)',
                  'Outreach Writer (30/week)',
                  'Priority support',
                  'Early feature access',
                ].map(f => (
                  <div key={f} style={{ display: 'flex', gap: 8, alignItems: 'center', fontSize: 12, color: 'var(--text-2)' }}>{CHECK}<span>{f}</span></div>
                ))}
              </div>

              <button
                onClick={() => { if (currentPlan === 'elite') return; handleSwitch(currentPlan, 'elite'); }}
                disabled={currentPlan === 'elite' || !!loading}
                type="button"
                style={{
                  width: '100%', padding: '12px 0', borderRadius: 10, marginTop: 20, border: 'none',
                  background: currentPlan === 'elite' ? 'rgba(37,99,235,0.15)' : 'linear-gradient(135deg, #2563eb, #3b82f6)',
                  color: currentPlan === 'elite' ? '#2563eb' : '#fff',
                  fontSize: 13, fontWeight: 700,
                  cursor: currentPlan === 'elite' ? 'default' : 'pointer',
                  fontFamily: "'Sora', sans-serif",
                  opacity: loading === 'elite' ? 0.6 : 1,
                }}
              >
                {currentPlan === 'elite' ? 'Current Plan' : loading === 'elite' ? 'Redirecting...' : 'Upgrade to Elite'}
              </button>
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
                <th style={{ padding: '14px 20px', textAlign: 'center', fontSize: 12, fontWeight: 700, color: 'var(--text-3)', textTransform: 'uppercase', letterSpacing: '1px', width: 120 }}>Basic</th>
                <th style={{ padding: '14px 20px', textAlign: 'center', fontSize: 12, fontWeight: 700, color: 'var(--text)', textTransform: 'uppercase', letterSpacing: '1px', width: 120 }}>Pro</th>
                <th style={{ padding: '14px 20px', textAlign: 'center', fontSize: 12, fontWeight: 700, color: '#2563eb', textTransform: 'uppercase', letterSpacing: '1px', width: 120 }}>Elite</th>
              </tr>
            </thead>
            <tbody>
              {FEATURES.map((f, i) => (
                <tr key={f.label} style={{ borderBottom: i < FEATURES.length - 1 ? '1px solid var(--border)' : 'none' }}>
                  <td style={{ padding: '12px 24px', fontSize: 13, color: 'var(--text)', fontWeight: 500 }}>{f.label}</td>
                  <td style={{ padding: '12px 20px' }}><div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>{f.free}</div></td>
                  <td style={{ padding: '12px 20px' }}><div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>{f.pro}</div></td>
                  <td style={{ padding: '12px 20px' }}><div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>{f.elite}</div></td>
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
      <style>{`
        @keyframes checkoutIn { from { opacity: 0; transform: translateY(12px); } to { opacity: 1; transform: none; } }
        @media (max-width: 900px) {
          .checkout-grid { grid-template-columns: 1fr !important; max-width: 420px; margin: 0 auto 48px !important; }
        }
      `}</style>
    </div>
  );
}
