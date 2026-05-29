'use client';
import { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Sidebar from '../components/Sidebar';
import '../contact-finder/contact-finder.css';
import './resume.css';

const TRACKS = ['Investment Banking','Private Equity','Consulting','Asset Management','Accounting & Audit','Sales & Trading','Equity Research','Real Estate','Venture Capital','Corporate Finance'];

// Map sidebar industry pill to our track names. Restructuring -> Investment Banking
// since it shares the IB skill set most closely.
const SIDEBAR_TO_TRACK: Record<string, string> = {
  'Investment Banking': 'Investment Banking',
  'Private Equity': 'Private Equity',
  'Restructuring': 'Investment Banking',
  'Consulting': 'Consulting',
  'Accounting & Audit': 'Accounting & Audit',
  'Asset Management': 'Asset Management',
  'Sales & Trading': 'Sales & Trading',
  'Equity Research': 'Equity Research',
  'Real Estate': 'Real Estate',
  'Venture Capital': 'Venture Capital',
};

function getSidebarTrack(): string {
  if (typeof window === 'undefined') return 'Investment Banking';
  try {
    const raw = localStorage.getItem('offerbell_onboarding_profile');
    if (!raw) return 'Investment Banking';
    const prof = JSON.parse(raw);
    const role = prof?.targetRoles?.[0];
    if (role && SIDEBAR_TO_TRACK[role]) return SIDEBAR_TO_TRACK[role];
  } catch {}
  return 'Investment Banking';
}

type ReviewData = {
  overallScore: number;
  headline: string;
  sections: Record<string, { score: number; feedback: string; suggestions: string[] }>;
  topStrengths: string[];
  criticalFixes: string[];
  rewrittenBullets: { original: string; improved: string }[];
  interviewReadiness: string;
};

type SavedReview = {
  id: string;
  date: string;
  track: string;
  fileName: string;
  overallScore: number;
  headline: string;
  review: ReviewData;
};

const REVIEW_HISTORY_KEY = 'offerbell_resume_reviews';
const MAX_SAVED_REVIEWS = 10;

export default function ResumeReviewPage() {
  const router = useRouter();
  const [track, setTrack] = useState('Investment Banking');
  const [trackMenuOpen, setTrackMenuOpen] = useState(false);
  const [fileName, setFileName] = useState('');
  const [resumeText, setResumeText] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [review, setReview] = useState<ReviewData | null>(null);
  const [reviewHistory, setReviewHistory] = useState<SavedReview[]>([]);
  const [viewingPast, setViewingPast] = useState<SavedReview | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);
  const [userPlan, setUserPlan] = useState('free');
  const trackMenuRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    if (!localStorage.getItem('offerbell_user_id')) { router.replace('/signin'); return; }
    import('../lib/plan').then(({ getUserPlan }) => { setUserPlan(getUserPlan()); });
    // Default track to whatever industry user selected in the sidebar
    setTrack(getSidebarTrack());
    try {
      const raw = localStorage.getItem(REVIEW_HISTORY_KEY);
      if (raw) setReviewHistory(JSON.parse(raw));
    } catch {}
  }, [router]);

  // Listen for sidebar industry changes to re-default the track when user hasn't picked yet
  useEffect(() => {
    function onProfileChanged() { setTrack(getSidebarTrack()); }
    window.addEventListener('offerbell-profile-changed', onProfileChanged);
    return () => window.removeEventListener('offerbell-profile-changed', onProfileChanged);
  }, []);

  // Close track menu on outside click
  useEffect(() => {
    function onDocClick(e: MouseEvent) {
      if (!trackMenuRef.current) return;
      if (!trackMenuRef.current.contains(e.target as Node)) setTrackMenuOpen(false);
    }
    if (trackMenuOpen) document.addEventListener('mousedown', onDocClick);
    return () => document.removeEventListener('mousedown', onDocClick);
  }, [trackMenuOpen]);

  // Extract text from PDF using pdf.js or fallback to FileReader
  const handleFile = async (file: File) => {
    setFileName(file.name);
    setError('');
    setReview(null);

    if (file.type === 'application/pdf') {
      try {
        let pdfjsLib = (window as any).pdfjsLib;
        if (!pdfjsLib) {
          await new Promise<void>((resolve, reject) => {
            const script = document.createElement('script');
            script.src = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.min.js';
            script.onload = () => {
              pdfjsLib = (window as any).pdfjsLib;
              if (pdfjsLib) {
                pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js';
              }
              resolve();
            };
            script.onerror = reject;
            document.head.appendChild(script);
          });
          pdfjsLib = (window as any).pdfjsLib;
        }
        if (pdfjsLib) {
          const arrayBuf = await file.arrayBuffer();
          const pdf = await pdfjsLib.getDocument({ data: arrayBuf }).promise;
          let text = '';
          for (let i = 1; i <= pdf.numPages; i++) {
            const page = await pdf.getPage(i);
            const content = await page.getTextContent();
            text += content.items.map((item: any) => item.str).join(' ') + '\n';
          }
          if (text.trim().length > 30) { setResumeText(text.trim()); return; }
        }
      } catch (err) {
        console.error('PDF parse error:', err);
      }
      const reader = new FileReader();
      reader.onload = () => { setResumeText(reader.result as string); };
      reader.readAsText(file);
    } else {
      const reader = new FileReader();
      reader.onload = () => { setResumeText(reader.result as string); };
      reader.readAsText(file);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file) handleFile(file);
  };

  // ── Usage limiting: Free = 1/week, Pro = 10/week, Elite = 30/week ──
  const [usageCount, setUsageCount] = useState(0);
  const [usageLoaded, setUsageLoaded] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem('offerbell_resume_usage');
      if (raw) {
        const data = JSON.parse(raw);
        const weekStart = getWeekStart();
        if (data.week === weekStart) {
          setUsageCount(data.count || 0);
        } else {
          localStorage.setItem('offerbell_resume_usage', JSON.stringify({ week: weekStart, count: 0 }));
          setUsageCount(0);
        }
      }
    } catch {}
    setUsageLoaded(true);
  }, []);

  function getWeekStart() {
    const now = new Date();
    const day = now.getDay();
    const diff = now.getDate() - day + (day === 0 ? -6 : 1);
    return new Date(now.getFullYear(), now.getMonth(), diff).toISOString().split('T')[0];
  }

  function incrementUsage() {
    const weekStart = getWeekStart();
    const nextWeekly = usageCount + 1;
    setUsageCount(nextWeekly);
    localStorage.setItem('offerbell_resume_usage', JSON.stringify({ week: weekStart, count: nextWeekly }));
  }

  const maxAllowed = userPlan === 'elite' ? 30 : userPlan === 'pro' ? 10 : 1;
  const remainingReviews = Math.max(0, maxAllowed - usageCount);
  const atLimit = remainingReviews <= 0;
  const usageChipClass = atLimit ? 'rr-usage-chip limit' : (remainingReviews <= 2 ? 'rr-usage-chip warn' : 'rr-usage-chip');

  function saveReviewToHistory(rev: ReviewData) {
    const saved: SavedReview = {
      id: Date.now().toString(),
      date: new Date().toISOString(),
      track,
      fileName: fileName || 'Untitled',
      overallScore: rev.overallScore,
      headline: rev.headline,
      review: rev,
    };
    const updated = [saved, ...reviewHistory].slice(0, MAX_SAVED_REVIEWS);
    setReviewHistory(updated);
    localStorage.setItem(REVIEW_HISTORY_KEY, JSON.stringify(updated));
  }

  function loadPastReview(saved: SavedReview) {
    setViewingPast(saved);
    setReview(saved.review);
    setFileName(saved.fileName);
  }

  function deletePastReview(id: string) {
    const updated = reviewHistory.filter(r => r.id !== id);
    setReviewHistory(updated);
    localStorage.setItem(REVIEW_HISTORY_KEY, JSON.stringify(updated));
  }

  const submitReview = async () => {
    if (!resumeText.trim()) { setError('Please upload a resume first.'); return; }
    if (atLimit) { setError(userPlan === 'free' ? 'You have used your weekly review. Upgrade to Pro for 10 reviews per week.' : `You have reached your weekly limit of ${maxAllowed} reviews. Resets every Monday.`); return; }
    setLoading(true);
    setError('');
    setReview(null);

    try {
      const res = await fetch('/api/resume-review', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ resumeText: resumeText.slice(0, 8000), targetTrack: track }),
      });
      const data = await res.json();

      if (data.error) {
        // Server returns { error: "limit_reached", message, plan, used, limit, ... }
        // Prefer the friendly message; fall back to error code mapping; sync state.
        const friendly = data.message
          || (data.error === 'limit_reached'
              ? `You've hit your weekly limit. ${data.limit ? `(${data.used}/${data.limit} used)` : ''} Resets Monday.`
              : data.error === 'Resume text too short or missing'
                ? 'That file looks empty. Try a different PDF or paste the text directly.'
                : data.error === 'All models failed'
                  ? 'Our reviewer is having trouble right now. Try again in a moment.'
                  : data.error);
        setError(friendly);
        // Convex is source of truth - sync local plan + usage to match server's view
        if (typeof data.plan === 'string') setUserPlan(data.plan);
        if (typeof data.used === 'number') {
          setUsageCount(data.used);
          try { localStorage.setItem('offerbell_resume_usage', JSON.stringify({ week: getWeekStart(), count: data.used })); } catch {}
        }
      }
      else if (data.review) {
        setReview(data.review);
        saveReviewToHistory(data.review);
        incrementUsage();
      }
      else if (data.raw) {
        let clientParsed = null;
        try {
          const raw = data.raw;
          const firstBrace = raw.indexOf('{');
          const lastBrace = raw.lastIndexOf('}');
          if (firstBrace !== -1 && lastBrace > firstBrace) {
            let slice = raw.slice(firstBrace, lastBrace + 1);
            slice = slice.replace(/,\s*([}\]])/g, '$1');
            clientParsed = JSON.parse(slice);
          }
        } catch {}
        if (clientParsed && typeof clientParsed.overallScore === 'number') {
          setReview(clientParsed);
          saveReviewToHistory(clientParsed);
        } else {
          setError('We received feedback but could not format it properly. Please try again.');
        }
        incrementUsage();
      }
      else { setError('Unexpected response. Please try again.'); }
    } catch (err: any) {
      setError('Failed to connect. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const scoreColor = (s: number) => s >= 8 ? 'var(--good)' : s >= 6 ? 'var(--warn)' : s >= 4 ? '#ea580c' : 'var(--bad)';
  const scoreLabel = (s: number) => s >= 8 ? 'Strong' : s >= 6 ? 'Good' : s >= 4 ? 'Needs Work' : 'Weak';

  return (
    <div className="rr-app">
      <Sidebar activePage="resume-review" />
      <div className="rr-canvas">
        <div className="rr-page">
          <div className="rr-page-inner">

            {/* ─── Top row ─── */}
            <div className="rr-top-row">
              <div className="rr-title-block">
                <h1 className="rr-page-title">Resume <em>Review</em></h1>
                <div className="rr-page-sub">
                  {!review
                    ? `Upload your resume and we will analyze every section against ${track} standards with specific, actionable feedback and rewritten bullets.`
                    : 'Detailed breakdown across every section of your resume.'}
                </div>
              </div>
            </div>

            {!review ? (
              /* ═══════════════════ UPLOAD VIEW ═══════════════════ */
              <div className="rr-grid">
                {/* ─── Main card: track picker + dropzone + submit ─── */}
                <div className="rr-card">
                  <div className="rr-card-head">
                    <div className="rr-track-row" ref={trackMenuRef} style={{ position: 'relative' }}>
                      <span className="rr-track-eyebrow">Target track</span>
                      <button
                        type="button"
                        className={`rr-track-pick${trackMenuOpen ? ' open' : ''}`}
                        onClick={() => !loading && setTrackMenuOpen(o => !o)}
                        disabled={loading}
                      >
                        {track}
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="6 9 12 15 18 9"/></svg>
                      </button>
                      {trackMenuOpen && (
                        <div className="rr-track-menu" style={{ top: '100%', left: 92 }}>
                          {TRACKS.map(t => (
                            <button
                              key={t}
                              type="button"
                              className={`rr-track-menu-item${t === track ? ' active' : ''}`}
                              onClick={() => { setTrack(t); setTrackMenuOpen(false); }}
                            >
                              {t}
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                    <div className={usageChipClass}>
                      {atLimit
                        ? `Weekly limit reached`
                        : `${remainingReviews} of ${maxAllowed} review${maxAllowed !== 1 ? 's' : ''} left`}
                    </div>
                  </div>

                  <div className="rr-card-body">
                    {/* Dropzone OR inline loading */}
                    <div
                      className={`rr-dropzone${fileName && !loading ? ' has-file' : ''}${loading ? ' loading' : ''}`}
                      onClick={() => { if (!loading && !fileName) fileRef.current?.click(); }}
                      onDragOver={e => { e.preventDefault(); if (loading) e.dataTransfer.dropEffect = 'none'; }}
                      onDrop={e => { if (loading) { e.preventDefault(); return; } handleDrop(e); }}
                    >
                      <input
                        ref={fileRef}
                        type="file"
                        accept=".pdf,.txt,.doc,.docx"
                        onChange={e => { const f = e.target.files?.[0]; if (f) handleFile(f); }}
                        hidden
                        disabled={loading}
                      />
                      {loading ? (
                        <div className="rr-loading-inline">
                          <div className="rr-loading-ring" />
                          <div className="rr-loading-title">Analyzing your <em>resume</em></div>
                          <div className="rr-loading-sub">Reviewing each section against {track} standards. This takes about 15 seconds.</div>
                        </div>
                      ) : fileName ? (
                        <div className="rr-file-info">
                          <svg width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>
                          <span>{fileName}</span>
                          <button
                            className="rr-change-file"
                            onClick={e => { e.stopPropagation(); setFileName(''); setResumeText(''); if (fileRef.current) fileRef.current.value = ''; }}
                            type="button"
                          >Change</button>
                        </div>
                      ) : (
                        <>
                          <div className="rr-drop-icon-wrap">
                            <svg width="26" height="26" fill="none" stroke="var(--text-2)" strokeWidth="1.6" viewBox="0 0 24 24"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>
                          </div>
                          <div className="rr-drop-text">Drop your resume here or click to upload</div>
                          <div className="rr-drop-hint">PDF, TXT, or DOC · 1 page recommended</div>
                        </>
                      )}
                    </div>

                    {error && <div className="rr-error">{error}</div>}

                    <button className="rr-submit-btn" onClick={submitReview} disabled={loading || !resumeText.trim() || atLimit} type="button">
                      {loading ? (
                        <><span className="rr-spinner" /> Analyzing your resume...</>
                      ) : atLimit ? (
                        userPlan === 'free' ? 'Upgrade to Pro for more reviews' : 'Weekly limit reached'
                      ) : (
                        'Review My Resume'
                      )}
                    </button>

                    {atLimit && (
                      <div style={{ marginTop: 10, fontSize: 11, color: 'var(--text-3)', textAlign: 'center' }}>
                        Resets every Monday.
                        <a href="/my-account" className="rr-upgrade-link">Upgrade plan</a>
                      </div>
                    )}
                  </div>
                </div>

                {/* ─── Side panel: past reviews ─── */}
                <aside className="rr-aside">
                  <div className="rr-aside-head">
                    <div className="rr-aside-title">Recent reviews</div>
                    <div className="rr-aside-sub">{reviewHistory.length} of {MAX_SAVED_REVIEWS} saved</div>
                  </div>
                  <div className="rr-aside-body">
                    {reviewHistory.length === 0 ? (
                      <div className="rr-aside-empty">
                        No past reviews yet. Submit your first resume and it will appear here.
                      </div>
                    ) : (
                      reviewHistory.map(r => (
                        <div key={r.id} className="rr-past-card" onClick={() => loadPastReview(r)}>
                          <div
                            className="rr-past-score"
                            style={{ borderColor: scoreColor(r.overallScore), color: scoreColor(r.overallScore) }}
                          >{r.overallScore}</div>
                          <div className="rr-past-info">
                            <div className="rr-past-name">{r.fileName}</div>
                            <div className="rr-past-meta">{r.track} · {new Date(r.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</div>
                          </div>
                          <button
                            className="rr-past-del"
                            onClick={e => { e.stopPropagation(); deletePastReview(r.id); }}
                            type="button"
                            title="Delete"
                          >&times;</button>
                        </div>
                      ))
                    )}
                  </div>
                </aside>
              </div>
            ) : (
              /* ═══════════════════ RESULTS VIEW ═══════════════════ */
              <div className="rr-results">
                <button
                  className="rr-back"
                  onClick={() => { setReview(null); setViewingPast(null); setFileName(''); setResumeText(''); }}
                  type="button"
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M19 12H5M12 19l-7-7 7-7"/></svg>
                  Upload another resume
                </button>

                {review && (
                  <>
                    {/* Header */}
                    <div className="rr-res-header">
                      <div>
                        <h2 className="rr-res-title">Score <em>breakdown</em></h2>
                        <div className="rr-res-meta">
                          <span className="rr-res-meta-chip">{track}</span>
                          <span>{fileName}</span>
                          {viewingPast && <span>· {new Date(viewingPast.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>}
                        </div>
                      </div>
                      <div className="rr-overall-score" style={{ borderColor: scoreColor(review.overallScore) }}>
                        <div className="rr-os-num" style={{ color: scoreColor(review.overallScore) }}>{review.overallScore}</div>
                        <div className="rr-os-label">{scoreLabel(review.overallScore)}</div>
                        <div className="rr-os-of">/10</div>
                      </div>
                    </div>

                    <div className="rr-headline">{review.headline}</div>

                    {/* Section scores */}
                    <div className="rr-sections">
                      {Object.entries(review.sections).map(([key, sec]) => (
                        <div key={key} className="rr-sec-card">
                          <div className="rr-sec-head">
                            <div className="rr-sec-name">{key.charAt(0).toUpperCase() + key.slice(1)}</div>
                            <div className="rr-sec-score" style={{ color: scoreColor(sec.score) }}>{sec.score}/10</div>
                          </div>
                          <div className="rr-sec-bar-wrap">
                            <div className="rr-sec-bar" style={{ width: `${sec.score * 10}%`, background: scoreColor(sec.score) }} />
                          </div>
                          <div className="rr-sec-feedback">{sec.feedback}</div>
                          {sec.suggestions && sec.suggestions.length > 0 && (
                            <div className="rr-sec-suggestions">
                              {sec.suggestions.map((s, i) => (
                                <div key={i} className="rr-suggestion">
                                  <svg width="11" height="11" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><polyline points="9 18 15 12 9 6"/></svg>
                                  {s}
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>

                    {/* Strengths & Critical Fixes */}
                    <div className="rr-two-col">
                      <div className="rr-col-card">
                        <div className="rr-col-title" style={{ color: 'var(--good)' }}>Top strengths</div>
                        {review.topStrengths?.map((s, i) => (
                          <div key={i} className="rr-col-item">
                            <svg width="14" height="14" fill="none" stroke="var(--good)" strokeWidth="2.2" viewBox="0 0 24 24"><polyline points="20 6 9 17 4 12"/></svg>
                            {s}
                          </div>
                        ))}
                      </div>
                      <div className="rr-col-card">
                        <div className="rr-col-title" style={{ color: 'var(--bad)' }}>Critical fixes</div>
                        {review.criticalFixes?.map((s, i) => (
                          <div key={i} className="rr-col-item">
                            <svg width="14" height="14" fill="none" stroke="var(--bad)" strokeWidth="2.2" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
                            {s}
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Rewritten bullets */}
                    {review.rewrittenBullets && review.rewrittenBullets.length > 0 && (
                      <div className="rr-rewrites">
                        <div className="rr-rewrites-title">Rewritten <em style={{ fontStyle: 'italic' }}>bullets</em></div>
                        <div className="rr-rewrites-sub">Here is how specific bullets from your resume could be improved.</div>
                        {review.rewrittenBullets.map((b, i) => (
                          <div key={i} className="rr-rewrite-pair">
                            <div className="rr-rw-before">
                              <span className="rr-rw-tag before">Before</span>
                              <span>{b.original}</span>
                            </div>
                            <div className="rr-rw-after">
                              <span className="rr-rw-tag after">After</span>
                              <span>{b.improved}</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Interview readiness */}
                    {review.interviewReadiness && (
                      <div className="rr-interview-ready">
                        <div className="rr-ir-title">Interview <em style={{ fontStyle: 'italic' }}>readiness</em></div>
                        <div className="rr-ir-text">{review.interviewReadiness}</div>
                      </div>
                    )}
                  </>
                )}
              </div>
            )}

          </div>
        </div>
      </div>
    </div>
  );
}
