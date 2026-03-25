'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { useMutation } from 'convex/react';
import { api } from '../../convex/_generated/api';

type TutorialOverlayProps = {
  userId: string;
  initialStep: number;
  onComplete: () => void;
};

const STEPS = [
  {
    title: 'Complete Your Profile',
    description: 'Select your school, graduation year, and target role so we can personalize everything for you.',
    route: '/my-account',
    spotlightSelector: '[data-tutorial="profile-section"]',
    cta: 'Go to My Account',
    validateBeforeAdvance: true,
  },
  {
    title: 'Upgrade & Manage Your Plan',
    description: 'This is where you can upgrade to Pro for unlimited outreach messages and AI Coach access — or downgrade anytime. No surprises.',
    route: '/my-account',
    spotlightSelector: '[data-tutorial="plan-section"]',
    cta: 'Got it',
    validateBeforeAdvance: false,
  },
  {
    title: 'Explore the Learning Hub',
    description: 'This is your command center for interview prep. Career roadmaps, reading guides, and industry-specific study paths — all in one place.',
    route: '/learn',
    spotlightSelector: '[data-tutorial="learning-hub"]',
    cta: 'Open Learning Hub',
    validateBeforeAdvance: false,
  },
  {
    title: 'Get Interview Ready',
    description: 'Dive into our reading guides and interview prep modules. Use the AI Coach, Outreach Writer, and Hit Rate Intel to connect with the right people at the right firms.',
    route: '/learn',
    spotlightSelector: '[data-tutorial="interview-guides"]',
    cta: 'See the Guides',
    validateBeforeAdvance: false,
  },
  {
    title: "You're All Set",
    description: '',
    route: '/dashboard',
    spotlightSelector: null,
    cta: 'Start Exploring',
    validateBeforeAdvance: false,
  },
];

export default function TutorialOverlay({ userId, initialStep, onComplete }: TutorialOverlayProps) {
  const router = useRouter();
  const setTutorialStep = useMutation(api.users.setTutorialStep);
  const completeTutorial = useMutation(api.users.completeTutorial);
  const [step, setStep] = useState(initialStep);
  const [spotlightRect, setSpotlightRect] = useState<DOMRect | null>(null);
  const [navigated, setNavigated] = useState(false);
  const [profileValid, setProfileValid] = useState(false);
  const [animating, setAnimating] = useState(true);

  // Entrance animation
  useEffect(() => {
    const t = setTimeout(() => setAnimating(false), 300);
    return () => clearTimeout(t);
  }, [step]);

  // Navigate to the correct route for the current step
  useEffect(() => {
    if (step < STEPS.length) {
      const s = STEPS[step];
      if (s.route) {
        router.push(s.route);
        setNavigated(true);
      }
    }
  }, [step, router]);

  // Find and highlight the spotlight element
  useEffect(() => {
    if (step >= STEPS.length) return;
    const s = STEPS[step];
    if (!s.spotlightSelector) { setSpotlightRect(null); return; }

    const findEl = () => {
      const el = document.querySelector(s.spotlightSelector!);
      if (el) {
        const rect = el.getBoundingClientRect();
        setSpotlightRect(rect);
        el.scrollIntoView({ behavior: 'smooth', block: 'center' });
      } else {
        setSpotlightRect(null);
      }
    };
    // Delay to let page render
    const t = setTimeout(findEl, 600);
    const t2 = setTimeout(findEl, 1200);
    return () => { clearTimeout(t); clearTimeout(t2); };
  }, [step, navigated]);

  // Check if profile is filled (for step 0)
  useEffect(() => {
    if (step !== 0) return;
    const check = () => {
      try {
        // Check DOM fields directly (My Account page form)
        const selects = document.querySelectorAll('[data-tutorial="profile-section"] select') as NodeListOf<HTMLSelectElement>;
        const firstNameInput = document.querySelector('[data-tutorial="profile-section"] input') as HTMLInputElement;

        if (selects.length >= 3 && firstNameInput) {
          const hasName = firstNameInput.value.trim().length > 0;
          const hasSchool = selects[0].value && selects[0].value !== '' && !selects[0].value.includes('Select');
          const hasYear = selects[1].value && selects[1].value !== '' && !selects[1].value.includes('Select');
          const hasRole = selects[2].value && selects[2].value !== '' && !selects[2].value.includes('Select');
          setProfileValid(!!(hasName && hasSchool && hasYear && hasRole));
          return;
        }

        setProfileValid(false);
      } catch { setProfileValid(false); }
    };
    check();
    const interval = setInterval(check, 500);
    return () => clearInterval(interval);
  }, [step]);

  const advance = useCallback(async () => {
    if (step === 0 && STEPS[0].validateBeforeAdvance && !profileValid) return;

    // If on step 0, trigger save on the My Account page
    if (step === 0) {
      const saveBtn = document.querySelector('[data-tutorial="profile-section"]')
        ?.parentElement
        ?.querySelector('button');
      // Find the Save Changes button by text
      const allBtns = document.querySelectorAll('button');
      for (const btn of allBtns) {
        if (btn.textContent?.includes('Save Changes') || btn.textContent?.includes('Save now')) {
          btn.click();
          break;
        }
      }
      // Small delay to let save complete
      await new Promise(r => setTimeout(r, 300));
    }

    const nextStep = step + 1;
    setAnimating(true);
    if (nextStep >= STEPS.length) {
      try { await completeTutorial({ userId: userId as any }); } catch {}
      localStorage.setItem('offerbell_tutorial_complete', 'true');
      onComplete();
    } else {
      try { await setTutorialStep({ userId: userId as any, step: nextStep }); } catch {}
      localStorage.setItem('offerbell_tutorial_step', String(nextStep));
      setStep(nextStep);
    }
  }, [step, profileValid, userId, completeTutorial, setTutorialStep, onComplete]);

  const skip = useCallback(async () => {
    try { await completeTutorial({ userId: userId as any }); } catch {}
    localStorage.setItem('offerbell_tutorial_complete', 'true');
    onComplete();
  }, [userId, completeTutorial, onComplete]);

  if (step >= STEPS.length) return null;
  const currentStep = STEPS[step];
  const isLast = step === STEPS.length - 1;

  // Elevate the spotlighted element above the overlay so it's fully interactive
  useEffect(() => {
    if (!currentStep.spotlightSelector) return;
    const el = document.querySelector(currentStep.spotlightSelector) as HTMLElement;
    if (el) {
      el.style.position = 'relative';
      el.style.zIndex = '100000';
      el.style.background = 'var(--surface, #fff)';
      el.style.borderRadius = '16px';
    }
    return () => {
      if (el) {
        el.style.zIndex = '';
        el.style.position = '';
        el.style.background = '';
        el.style.borderRadius = '';
      }
    };
  }, [step, currentStep.spotlightSelector, navigated]);

  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 99999,
      transition: 'opacity .3s',
      opacity: animating ? 0 : 1,
    }}>
      {/* Single full-screen dim overlay — blocks all clicks */}
      <div style={{ position:'fixed', inset:0, background: isLast ? 'rgba(0,0,0,0.75)' : 'rgba(0,0,0,0.65)' }} />

      {/* Card */}
      <div style={{
        position: 'absolute',
        bottom: isLast ? '50%' : '32px',
        left: '50%',
        transform: isLast ? 'translate(-50%, 50%)' : 'translateX(-50%)',
        width: isLast ? '440px' : '400px',
        background: '#111110',
        border: '1px solid rgba(255,255,255,0.08)',
        borderRadius: '20px',
        padding: isLast ? '40px 36px' : '28px 28px 24px',
        boxShadow: '0 24px 80px rgba(0,0,0,0.5)',
        textAlign: isLast ? 'center' : 'left',
      }}>
        {/* Step indicator */}
        {!isLast && (
          <div style={{ display: 'flex', gap: '6px', marginBottom: '18px' }}>
            {STEPS.slice(0, -1).map((_, i) => (
              <div key={i} style={{
                height: '3px', flex: 1, borderRadius: '100px',
                background: i <= step ? '#fff' : 'rgba(255,255,255,0.1)',
                transition: 'background .3s',
              }} />
            ))}
          </div>
        )}

        {isLast && (
          <div style={{ marginBottom: '20px' }}>
            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" style={{ margin: '0 auto' }}>
              <circle cx="12" cy="12" r="10" fill="#10b981" />
              <path d="M8 12l2.5 2.5L16 9.5" stroke="#fff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
        )}

        <div style={{
          fontFamily: "'Instrument Serif', serif",
          fontSize: isLast ? '28px' : '22px',
          color: '#fff',
          marginBottom: '8px',
          letterSpacing: '-0.3px',
        }}>
          {currentStep.title}
        </div>

        {currentStep.description && (
          <p style={{
            fontSize: '14px', color: 'rgba(255,255,255,0.55)',
            lineHeight: 1.6, marginBottom: '20px',
          }}>
            {currentStep.description}
          </p>
        )}

        {isLast && (
          <p style={{ fontSize: '13px', color: 'rgba(255,255,255,0.4)', lineHeight: 1.6, marginBottom: '24px' }}>
            Your profile is set up, you've seen the Learning Hub and interview guides. You're ready to start networking and prepping.
          </p>
        )}

        {step === 0 && !profileValid && (
          <div style={{
            fontSize: '12px', color: '#f59e0b', marginBottom: '14px',
            display: 'flex', alignItems: 'center', gap: '6px',
          }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
            Fill out your school, year, and target role to continue
          </div>
        )}

        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '10px' }}>
          <button onClick={advance} disabled={step === 0 && !profileValid} style={{
            background: (step === 0 && !profileValid) ? 'rgba(255,255,255,0.1)' : '#fff',
            color: (step === 0 && !profileValid) ? 'rgba(255,255,255,0.3)' : '#0c0c0c',
            border: 'none', borderRadius: '10px',
            padding: isLast ? '12px 32px' : '10px 22px',
            fontSize: '13px', fontWeight: 700, cursor: (step === 0 && !profileValid) ? 'not-allowed' : 'pointer',
            fontFamily: "'Sora', sans-serif",
            transition: 'all .15s',
          }}>
            {isLast ? 'Start Exploring →' : currentStep.cta + ' →'}
          </button>
        </div>
      </div>
    </div>
  );
}
