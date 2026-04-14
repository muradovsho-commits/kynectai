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

export default function ResumeReviewPage() {
  const router = useRouter();
  const [track, setTrack] = useState('Investment Banking');
  const [fileName, setFileName] = useState('');
  const [resumeText, setResumeText] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [review, setReview] = useState<ReviewData | null>(null);
  const [rawFallback, setRawFallback] = useState('');
  const fileRef = useRef<HTMLInputElement>(null);
  const [userPlan, setUserPlan] = useState('free');

  useEffect(() => {
    if (typeof window === 'undefined') return;
    if (!localStorage.getItem('offerbell_user_id')) { router.replace('/signin'); return; }
    import('../lib/plan').then(({ isUserPro }) => { setUserPlan(isUserPro() ? 'pro' : 'free'); });
  }, [router]);

  // Extract text from PDF using pdf.js or fallback to FileReader
  const handleFile = async (file: File) => {
    setFileName(file.name);
    setError('');
    setReview(null);
    setRawFallback('');

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

  // ── Usage limiting: Free = 1 total ever, Pro = 10 per week ──
  const MAX_FREE = 1;
  const MAX_PRO_WEEK = 10;
  const [usageCount, setUsageCount] = useState(0);
  const [lifetimeCount, setLifetimeCount] = useState(0);
  const [usageLoaded, setUsageLoaded] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem('offerbell_resume_usage');
      if (raw) {
        const data = JSON.parse(raw);
        setLifetimeCount(data.lifetime || 0);
        const weekStart = getWeekStart();
        if (data.week === weekStart) {
          setUsageCount(data.count || 0);
        } else {
          // New week - reset weekly count but keep lifetime
          localStorage.setItem('offerbell_resume_usage', JSON.stringify({ week: weekStart, count: 0, lifetime: data.lifetime || 0 }));
          setUsageCount(0);
        }
      }
    } catch {}
    setUsageLoaded(true);
  }, []);

  function getWeekStart() {
    const now = new Date();
    const day = now.getDay();
    const diff = now.getDate() - day + (day === 0 ? -6 : 1); // Monday start
    return new Date(now.getFullYear(), now.getMonth(), diff).toISOString().split('T')[0];
  }

  function incrementUsage() {
    const weekStart = getWeekStart();
    const nextWeekly = usageCount + 1;
    const nextLifetime = lifetimeCount + 1;
    setUsageCount(nextWeekly);
    setLifetimeCount(nextLifetime);
    localStorage.setItem('offerbell_resume_usage', JSON.stringify({ week: weekStart, count: nextWeekly, lifetime: nextLifetime }));
  }

  const isPro = userPlan === 'pro';
  const maxAllowed = isPro ? MAX_PRO_WEEK : MAX_FREE;
  const currentUsage = isPro ? usageCount : lifetimeCount;
  const remainingReviews = Math.max(0, maxAllowed - currentUsage);
  const atLimit = remainingReviews <= 0;

  const submitReview = async () => {
    if (!resumeText.trim()) { setError('Please upload a resume first.'); return; }
    if (atLimit) { setError(isPro ? 'You\'ve reached your weekly limit of 10 reviews. Resets every Monday.' : 'You\'ve used your free review. Upgrade to Pro for 10 reviews per week.'); return; }
    setLoading(true);
    setError('');
    setReview(null);
    setRawFallback('');

    try {
      const res = await fetch('/api/resume-review', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ resumeText: resumeText.slice(0, 8000), targetTrack: track }),
      });
      const data = await res.json();

      if (data.error) { setError(data.error); }
      else if (data.review) { setReview(data.review); incrementUsage(); }
      else if (data.raw) { setRawFallback(data.raw); incrementUsage(); }
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
        {!review && !rawFallback ? (
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
                        <button key={t} className={`rr-pill${track === t ? ' active' : ''}`} onClick={() => setTrack(t)} type="button">{t}</button>
                      ))}
                    </div>
                  </div>
                </div>

                <div
                  className={`rr-dropzone${fileName ? ' has-file' : ''}`}
                  onClick={() => fileRef.current?.click()}
                  onDragOver={e => e.preventDefault()}
                  onDrop={handleDrop}
                >
                  <input ref={fileRef} type="file" accept=".pdf,.txt,.doc,.docx" onChange={e => { const f = e.target.files?.[0]; if (f) handleFile(f); }} hidden />
                  {fileName ? (
                    <div className="rr-file-info">
                      <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>
                      <span>{fileName}</span>
                      <button className="rr-change-file" onClick={e => { e.stopPropagation(); setFileName(''); setResumeText(''); fileRef.current!.value = ''; }} type="button">Change</button>
                    </div>
                  ) : (
                    <>
                      <svg width="32" height="32" fill="none" stroke="var(--text-3)" strokeWidth="1.5" viewBox="0 0 24 24"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>
                      <div className="rr-drop-text">Drop your resume here or click to upload</div>
                      <div className="rr-drop-hint">PDF, TXT, or DOC · Max 5 pages</div>
                    </>
                  )}
                </div>

                {error && <div className="rr-error">{error}</div>}

                <div className="rr-usage">
                  {isPro ? (
                    <>
                      <span className="rr-usage-count">{remainingReviews} of {MAX_PRO_WEEK} reviews remaining this week</span>
                      {remainingReviews <= 2 && remainingReviews > 0 && <span className="rr-usage-warn">Use them wisely</span>}
                      {atLimit && <span className="rr-usage-reset">Resets every Monday</span>}
                    </>
                  ) : (
                    <>
                      <span className="rr-usage-count">{remainingReviews > 0 ? `${remainingReviews} free review available` : 'Free review used'}</span>
                      {atLimit && <span className="rr-usage-reset"><a href="/checkout" style={{color:'var(--text)',fontWeight:700,textDecoration:'underline'}}>Upgrade to Pro</a> for 10 reviews per week</span>}
                    </>
                  )}
                </div>

                <button className="rr-submit-btn" onClick={submitReview} disabled={loading || !resumeText.trim() || atLimit} type="button">
                  {loading ? (
                    <><span className="rr-spinner" /> Analyzing your resume...</>
                  ) : atLimit ? (
                    isPro ? 'Weekly limit reached' : 'Upgrade to Pro for more reviews'
                  ) : (
                    'Review My Resume'
                  )}
                </button>
              </>
          </div>
        ) : (
          /* ═══ RESULTS ═══ */
          <div className="rr-results">
            <button className="rr-back" onClick={() => { setReview(null); setRawFallback(''); setFileName(''); setResumeText(''); }} type="button">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M19 12H5M12 19l-7-7 7-7"/></svg>
              Upload another resume
            </button>

            {rawFallback && !review && (
              <div className="rr-raw">
                <h3>Resume Feedback</h3>
                <div className="rr-raw-text" dangerouslySetInnerHTML={{ __html: rawFallback.replace(/\n/g, '<br/>') }} />
              </div>
            )}

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
