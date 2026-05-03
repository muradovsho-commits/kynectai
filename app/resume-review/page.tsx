'use client';
import { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Sidebar from '../components/Sidebar';
import '../contact-finder/contact-finder.css';
import './resume.css';

const TRACKS = ['Investment Banking','Private Equity','Consulting','Asset Management','Accounting & Audit','Sales & Trading','Equity Research','Real Estate','Venture Capital','Corporate Finance'];

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
  const [fileName, setFileName] = useState('');
  const [resumeText, setResumeText] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [review, setReview] = useState<ReviewData | null>(null);
  const [reviewHistory, setReviewHistory] = useState<SavedReview[]>([]);
  const [viewingPast, setViewingPast] = useState<SavedReview | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);
  const [userPlan, setUserPlan] = useState('free');

  useEffect(() => {
    if (typeof window === 'undefined') return;
    if (!localStorage.getItem('offerbell_user_id')) { router.replace('/signin'); return; }
    import('../lib/plan').then(({ isUserPro }) => { setUserPlan(isUserPro() ? 'pro' : 'free'); });
    // Load review history
    try {
      const raw = localStorage.getItem(REVIEW_HISTORY_KEY);
      if (raw) setReviewHistory(JSON.parse(raw));
    } catch {}
  }, [router]);

  // Extract text from PDF using pdf.js or fallback to FileReader
  const handleFile = async (file: File) => {
    setFileName(file.name);
    setError('');
    setReview(null);

    if (file.type === 'application/pdf') {
      try {
        // Dynamically load pdf.js if not already loaded
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
      // Fallback: read as text
      const reader = new FileReader();
      reader.onload = () => { setResumeText(reader.result as string); };
      reader.readAsText(file);
    } else {
      // For .txt, .doc files - read as text
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

      if (data.error) { setError(data.error); }
      else if (data.review) {
        setReview(data.review);
        saveReviewToHistory(data.review);
        incrementUsage();
      }
      else if (data.raw) {
        // Server couldn't parse the JSON - try one more time client-side
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

  const scoreColor = (s: number) => s >= 8 ? '#16a34a' : s >= 6 ? '#d97706' : s >= 4 ? '#ea580c' : '#dc2626';
  const scoreLabel = (s: number) => s >= 8 ? 'Strong' : s >= 6 ? 'Good' : s >= 4 ? 'Needs Work' : 'Weak';

  return (
    <div className="app">
      <Sidebar activePage="resume-review" />

      <main className="main rr-main">
        {!review ? (
          <div className="rr-upload-view">
            <div className="rr-badge">Resume Review</div>
            <h1 className="rr-title">Get your resume <em>reviewed.</em></h1>
            <p className="rr-sub">Upload your resume and select your target career track. Our AI will analyze every section and give you specific, actionable feedback - with rewritten bullet examples.</p>

              <>
                <div className="rr-config">
                  <div className="rr-field">
                    <label className="rr-label">Target Career Track</label>
                    <div className="rr-pills">
                      {TRACKS.map(t => (
                        <button key={t} className={`rr-pill${track === t ? ' active' : ''}`} onClick={() => !loading && setTrack(t)} type="button" style={{ opacity: loading ? 0.5 : 1, pointerEvents: loading ? 'none' : 'auto' }}>{t}</button>
                      ))}
                    </div>
                  </div>
                </div>

                <div
                  className={`rr-dropzone${fileName ? ' has-file' : ''}${loading ? ' loading' : ''}`}
                  onClick={() => !loading && fileRef.current?.click()}
                  onDragOver={e => { e.preventDefault(); if (loading) e.dataTransfer.dropEffect = 'none'; }}
                  onDrop={e => { if (loading) { e.preventDefault(); return; } handleDrop(e); }}
                  style={{ pointerEvents: loading ? 'none' : 'auto', opacity: loading ? 0.5 : 1, transition: 'opacity 0.2s' }}
                >
                  <input ref={fileRef} type="file" accept=".pdf,.txt,.doc,.docx" onChange={e => { const f = e.target.files?.[0]; if (f) handleFile(f); }} hidden disabled={loading} />
                  {fileName ? (
                    <div className="rr-file-info">
                      <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>
                      <span>{fileName}</span>
                      {!loading && <button className="rr-change-file" onClick={e => { e.stopPropagation(); setFileName(''); setResumeText(''); fileRef.current!.value = ''; }} type="button">Change</button>}
                    </div>
                  ) : (
                    <>
                      <svg width="32" height="32" fill="none" stroke="var(--text-3)" strokeWidth="1.5" viewBox="0 0 24 24"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>
                      <div className="rr-drop-text">Drop your resume here or click to upload</div>
                      <div className="rr-drop-hint">PDF, TXT, or DOC - Max 5 pages</div>
                    </>
                  )}
                </div>

                {/* Loading overlay */}
                {loading && (
                  <div style={{ background: 'var(--surface)', border: '1.5px solid var(--border)', borderRadius: 14, padding: '40px 28px', textAlign: 'center', marginTop: -8, marginBottom: 8 }}>
                    <div style={{ width: 48, height: 48, borderRadius: '50%', border: '3px solid var(--border)', borderTopColor: 'var(--text)', margin: '0 auto 18px', animation: 'rr-spin 0.8s linear infinite' }} />
                    <div style={{ fontFamily: "'Instrument Serif', serif", fontSize: 22, color: 'var(--text)', marginBottom: 6, letterSpacing: '-0.4px' }}>Analyzing your <em style={{ fontStyle: 'italic' }}>resume</em></div>
                    <div style={{ fontSize: 13, color: 'var(--text-3)', lineHeight: 1.5 }}>Reviewing each section against {track} standards. This takes about 15 seconds.</div>
                  </div>
                )}

                {error && <div className="rr-error">{error}</div>}

                <div className="rr-usage">
                  <span className="rr-usage-count">{remainingReviews} of {maxAllowed} review{maxAllowed !== 1 ? 's' : ''} remaining this week</span>
                  {atLimit && <span className="rr-usage-reset">Resets every Monday. <a href="/checkout" style={{color:'var(--text)',fontWeight:700,textDecoration:'underline'}}>Upgrade</a> for more.</span>}
                  {!atLimit && remainingReviews <= 2 && remainingReviews > 0 && <span className="rr-usage-warn">Use them wisely</span>}
                </div>

                <button className="rr-submit-btn" onClick={submitReview} disabled={loading || !resumeText.trim() || atLimit} type="button">
                  {loading ? (
                    <><span className="rr-spinner" /> Analyzing your resume...</>
                  ) : atLimit ? (
                    userPlan === 'free' ? 'Upgrade to Pro for more reviews' : 'Weekly limit reached'
                  ) : (
                    'Review My Resume'
                  )}
                </button>

                {/* Past Reviews */}
                {reviewHistory.length > 0 && (
                  <div style={{ marginTop: 32 }}>
                    <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: '1.5px', textTransform: 'uppercase', color: 'var(--text-3)', marginBottom: 12 }}>Past Reviews</div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                      {reviewHistory.map(r => {
                        const scoreColor = r.overallScore >= 8 ? '#16a34a' : r.overallScore >= 6 ? '#d97706' : r.overallScore >= 4 ? '#ea580c' : '#dc2626';
                        return (
                          <div key={r.id} style={{
                            display: 'flex', alignItems: 'center', gap: 14,
                            background: 'var(--surface)', border: '1px solid var(--border)',
                            borderRadius: 12, padding: '12px 16px', cursor: 'pointer',
                            transition: 'background 0.12s',
                          }}
                            onClick={() => loadPastReview(r)}
                            onMouseEnter={e => (e.currentTarget.style.background = 'var(--surface-2)')}
                            onMouseLeave={e => (e.currentTarget.style.background = 'var(--surface)')}
                          >
                            <div style={{
                              width: 40, height: 40, borderRadius: 10,
                              border: `2px solid ${scoreColor}`,
                              display: 'flex', alignItems: 'center', justifyContent: 'center',
                              fontFamily: "'Instrument Serif', serif", fontSize: 18,
                              color: scoreColor, flexShrink: 0,
                            }}>{r.overallScore}</div>
                            <div style={{ flex: 1, minWidth: 0 }}>
                              <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--text)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{r.fileName}</div>
                              <div style={{ fontSize: 11, color: 'var(--text-3)', marginTop: 2 }}>
                                {r.track} - {new Date(r.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                              </div>
                            </div>
                            <button
                              onClick={e => { e.stopPropagation(); deletePastReview(r.id); }}
                              type="button"
                              style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-3)', fontSize: 16, padding: '0 4px', lineHeight: 1 }}
                            >&times;</button>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}
              </>
          </div>
        ) : (
          /* ═══ RESULTS ═══ */
          <div className="rr-results">
            <button className="rr-back" onClick={() => { setReview(null); setViewingPast(null); setFileName(''); setResumeText(''); }} type="button">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M19 12H5M12 19l-7-7 7-7"/></svg>
              Upload another resume
            </button>

            {review && (
              <>
                {/* Header */}
                <div className="rr-res-header">
                  <div>
                    <h2 className="rr-res-title">Resume <em>Review</em></h2>
                    <div className="rr-res-meta">{track} · {fileName}</div>
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
                              <svg width="12" height="12" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><polyline points="9 18 15 12 9 6"/></svg>
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
                    <div className="rr-col-title" style={{ color: '#16a34a' }}>Top Strengths</div>
                    {review.topStrengths?.map((s, i) => (
                      <div key={i} className="rr-col-item strength">
                        <svg width="14" height="14" fill="none" stroke="#16a34a" strokeWidth="2" viewBox="0 0 24 24"><polyline points="20 6 9 17 4 12"/></svg>
                        {s}
                      </div>
                    ))}
                  </div>
                  <div className="rr-col-card">
                    <div className="rr-col-title" style={{ color: '#dc2626' }}>Critical Fixes</div>
                    {review.criticalFixes?.map((s, i) => (
                      <div key={i} className="rr-col-item fix">
                        <svg width="14" height="14" fill="none" stroke="#dc2626" strokeWidth="2" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
                        {s}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Rewritten bullets */}
                {review.rewrittenBullets && review.rewrittenBullets.length > 0 && (
                  <div className="rr-rewrites">
                    <div className="rr-rewrites-title">Rewritten Bullets</div>
                    <div className="rr-rewrites-sub">Here's how specific bullets from your resume could be improved.</div>
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
                    <div className="rr-ir-title">Interview Readiness</div>
                    <div className="rr-ir-text">{review.interviewReadiness}</div>
                  </div>
                )}
              </>
            )}
          </div>
        )}
      </main>
    </div>
  );
}
