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
    cta: 'Continue',
    validateBeforeAdvance: true,
  },
  {
    title: 'Manage Your Plan',
    description: 'This is where you manage your plan. Upgrade to Pro or Elite whenever you want, or downgrade anytime.',
    route: '/my-account',
    spotlightSelector: '[data-tutorial="plan-section"]',
    cta: 'Got it',
    validateBeforeAdvance: false,
  },
  {
    title: 'Meet OB, your flagship',
    description: 'OB is our flagship, a desktop voice assistant built on all of OfferBell. Run mock interviews, company teardowns, and coffee-chat prep just by talking. You will find it right here under Home.',
    route: '/ob',
    spotlightSelector: '[data-tutorial="subtab-ob"]',
    cta: 'Continue',
    validateBeforeAdvance: false,
  },
  {
    title: 'Learn the material',
    description: 'Under Learn you get Guides for every role, an AI Coach you can chat with, and The Desk, where you work a real day on the job and get graded.',
    route: '/learn',
    spotlightSelector: '[data-tutorial="nav-learn"]',
    cta: 'Continue',
    validateBeforeAdvance: false,
  },
  {
    title: 'Prep and practice',
    description: 'Prep is where you drill: Concept Drills, Interview Flashcards, and full Mock Interviews to get you rep ready.',
    route: '/concept-drills',
    spotlightSelector: '[data-tutorial="nav-prep"]',
    cta: 'Continue',
    validateBeforeAdvance: false,
  },
  {
    title: 'Build your network',
    description: 'Network keeps every conversation in one place: an Outreach Tracker, an AI Outreach Writer, and a Referral Map.',
    route: '/outreach-tracker',
    spotlightSelector: '[data-tutorial="nav-networking"]',
    cta: 'Continue',
    validateBeforeAdvance: false,
  },
  {
    title: 'Sharpen with Insights',
    description: 'Insights grades your work. Resume Review scores your resume section by section, and Diagnostic Review finds your weak spots.',
    route: '/resume-review',
    spotlightSelector: '[data-tutorial="nav-insights"]',
    cta: 'Continue',
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

  // Find and track the spotlight element. Polls every 150ms while step is active
  // so the rect stays accurate across scrolls, late page mounts, and resizes.
  useEffect(() => {
    if (step >= STEPS.length) return;
    const s = STEPS[step];
    if (!s.spotlightSelector) { setSpotlightRect(null); return; }

    let cancelled = false;
    let scrolledOnce = false;

    const tick = () => {
      if (cancelled) return;
      const el = document.querySelector(s.spotlightSelector!);
      if (!el) {
        setSpotlightRect(null);
        return;
      }
      const rect = el.getBoundingClientRect();
      setSpotlightRect(prev => {
        if (prev && prev.left === rect.left && prev.top === rect.top && prev.width === rect.width && prev.height === rect.height) {
          return prev;
        }
        return rect;
      });
      // Bring it into view on first sighting only
      if (!scrolledOnce) {
        el.scrollIntoView({ behavior: 'smooth', block: 'center' });
        scrolledOnce = true;
      }
    };

    tick();
    const interval = setInterval(tick, 150);
    return () => { cancelled = true; clearInterval(interval); };
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
      try { const raw = localStorage.getItem('offerbell_onboarding_profile'); if (raw) { const p = JSON.parse(raw); p.tutorialComplete = true; localStorage.setItem('offerbell_onboarding_profile', JSON.stringify(p)); } } catch {}
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
    try { const raw = localStorage.getItem('offerbell_onboarding_profile'); if (raw) { const p = JSON.parse(raw); p.tutorialComplete = true; localStorage.setItem('offerbell_onboarding_profile', JSON.stringify(p)); } } catch {}
    onComplete();
  }, [userId, completeTutorial, onComplete]);

  if (step >= STEPS.length) return null;
  const currentStep = STEPS[step];
  const isLast = step === STEPS.length - 1;

  // Elevate the spotlighted element above the overlay ONLY for interactive steps
  const needsInteraction = step === 0; // Only profile step needs form interaction
  useEffect(() => {
    if (!currentStep.spotlightSelector || !needsInteraction) return;
    const apply = () => {
      const el = document.querySelector(currentStep.spotlightSelector!) as HTMLElement;
      if (!el) return;
      el.style.position = 'relative';
      el.style.zIndex = '100000';
      el.style.background = 'var(--surface, #fff)';
      el.style.borderRadius = '16px';
    };
    const t1 = setTimeout(apply, 400);
    const t2 = setTimeout(apply, 900);
    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      const el = document.querySelector(currentStep.spotlightSelector!) as HTMLElement;
      if (el) {
        el.style.zIndex = '';
        el.style.position = '';
        el.style.background = '';
        el.style.borderRadius = '';
      }
    };
  }, [step, currentStep.spotlightSelector, navigated, needsInteraction]);

  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 99999,
      transition: 'opacity .3s',
      opacity: animating ? 0 : 1,
    }}>
      {/* Dim overlay with a cutout around the spotlight rect.
          Falls back to a flat dim if no spotlight target is set. */}
      {spotlightRect ? (
        <svg style={{ position: 'fixed', inset: 0, width: '100%', height: '100%' }}>
          <defs>
            <mask id="offerbell-spotlight-mask">
              <rect width="100%" height="100%" fill="white" />
              <rect
                x={Math.max(0, spotlightRect.left - 10)}
                y={Math.max(0, spotlightRect.top - 10)}
                width={spotlightRect.width + 20}
                height={spotlightRect.height + 20}
                rx="14"
                ry="14"
                fill="black"
              />
            </mask>
          </defs>
          <rect
            width="100%"
            height="100%"
            fill={isLast ? 'rgba(0,0,0,0.75)' : 'rgba(0,0,0,0.65)'}
            mask="url(#offerbell-spotlight-mask)"
          />
          {/* Thin highlight ring around the cutout */}
          <rect
            x={Math.max(0, spotlightRect.left - 10)}
            y={Math.max(0, spotlightRect.top - 10)}
            width={spotlightRect.width + 20}
            height={spotlightRect.height + 20}
            rx="14"
            ry="14"
            fill="none"
            stroke="rgba(255,255,255,0.35)"
            strokeWidth="1.5"
          />
        </svg>
      ) : (
        <div style={{ position:'fixed', inset:0, background: isLast ? 'rgba(0,0,0,0.75)' : 'rgba(0,0,0,0.65)' }} />
      )}

      {/* Card */}
      <div style={{
        position: 'fixed',
        bottom: isLast ? '50%' : '32px',
        left: '50%',
        transform: isLast ? 'translate(-50%, 50%)' : 'translateX(-50%)',
        width: isLast ? '440px' : '400px',
        maxWidth: '90vw',
        background: '#ffffff',
        border: '1px solid rgba(0,0,0,0.06)',
        borderRadius: '18px',
        padding: isLast ? '40px 36px' : '26px 28px 22px',
        boxShadow: '0 30px 90px rgba(0,0,0,0.45)',
        textAlign: isLast ? 'center' : 'left',
        zIndex: 100001,
      }}>
        {/* Step indicator */}
        {!isLast && (
          <div style={{ display: 'flex', gap: '6px', marginBottom: '18px' }}>
            {STEPS.slice(0, -1).map((_, i) => (
              <div key={i} style={{
                height: '3px', flex: 1, borderRadius: '100px',
                background: i <= step ? '#a97c3f' : 'rgba(0,0,0,0.08)',
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
          fontSize: isLast ? '30px' : '24px',
          color: '#1a1a1a',
          marginBottom: '8px',
          letterSpacing: '-0.3px',
        }}>
          {currentStep.title}
        </div>

        {currentStep.description && (
          <p style={{
            fontSize: '14px', color: '#5a5a5a',
            lineHeight: 1.6, marginBottom: '20px',
          }}>
            {currentStep.description}
          </p>
        )}

        {isLast && (
          <p style={{ fontSize: '14px', color: '#5a5a5a', lineHeight: 1.6, marginBottom: '24px' }}>
            Your profile is set, and you've seen OB, Learn, Prep, Network, and Insights. You're ready to start prepping and networking.
          </p>
        )}

        {step === 0 && !profileValid && (
          <div style={{
            fontSize: '12.5px', color: '#b45309', marginBottom: '14px',
            display: 'flex', alignItems: 'center', gap: '6px',
          }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
            Fill out your school, year, and target role to continue
          </div>
        )}

        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '10px' }}>
          <button onClick={advance} disabled={step === 0 && !profileValid} style={{
            background: (step === 0 && !profileValid) ? 'rgba(0,0,0,0.08)' : '#1a1a1a',
            color: (step === 0 && !profileValid) ? 'rgba(0,0,0,0.3)' : '#ffffff',
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
