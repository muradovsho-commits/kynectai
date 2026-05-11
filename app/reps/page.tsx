'use client';

import Sidebar from '../components/Sidebar';
import { useState, useEffect, useRef, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import '../contact-finder/contact-finder.css';
import './reps.css';
import { CAREERS, getCareer, getScenario, type CareerTrack, type Scenario, type Persona, type ScenarioStep } from './reps-data';

type Phase = 'careers' | 'scenarios' | 'session' | 'reflection';

type FeedItem = {
  id: string;
  type: 'time' | 'message' | 'user' | 'task' | 'interrupt' | 'review' | 'typing';
  persona?: Persona;
  content: string;
  timeLabel?: string;
  stepType?: string;
};

export default function RepsPage() {
  const router = useRouter();
  const [phase, setPhase] = useState<Phase>('careers');
  const [selectedCareer, setSelectedCareer] = useState<CareerTrack | null>(null);
  const [selectedScenario, setSelectedScenario] = useState<Scenario | null>(null);
  const [currentStepIdx, setCurrentStepIdx] = useState(0);
  const [feed, setFeed] = useState<FeedItem[]>([]);
  const [inputVal, setInputVal] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [sessionComplete, setSessionComplete] = useState(false);
  const [reflectionText, setReflectionText] = useState('');
  const [conversationHistory, setConversationHistory] = useState<{ role: string; content: string }[]>([]);

  const feedRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    if (!window.localStorage.getItem('offerbell_user_id')) { router.replace('/signin'); return; }
    const theme = localStorage.getItem('offerbell-theme');
    if (theme === 'dark') document.documentElement.setAttribute('data-theme', 'dark');
  }, [router]);

  // Auto-scroll feed
  useEffect(() => {
    if (feedRef.current) {
      feedRef.current.scrollTop = feedRef.current.scrollHeight;
    }
  }, [feed]);

  const addFeedItem = useCallback((item: Omit<FeedItem, 'id'>) => {
    setFeed(prev => [...prev, { ...item, id: `f-${Date.now()}-${Math.random().toString(36).slice(2, 6)}` }]);
  }, []);

  const callAI = useCallback(async (userMsg: string, persona: Persona, stepType: string) => {
    const newHistory = [...conversationHistory, { role: 'user', content: userMsg }];
    setConversationHistory(newHistory);

    try {
      const res = await fetch('/api/reps', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          messages: newHistory,
          persona: { name: persona.name, title: persona.title, firm: persona.firm, style: persona.style },
          context: selectedScenario?.context || '',
          stepType,
        }),
      });

      if (!res.ok) throw new Error('API failed');
      const data = await res.json();
      const aiText = data.text || 'Let me think about that...';

      setConversationHistory(prev => [...prev, { role: 'assistant', content: aiText }]);
      return aiText;
    } catch {
      return 'Give me a moment - let me gather my thoughts on that.';
    }
  }, [conversationHistory, selectedScenario]);

  // Start a session - deliver the first step
  const startSession = useCallback(async (scenario: Scenario) => {
    setSelectedScenario(scenario);
    setPhase('session');
    setCurrentStepIdx(0);
    setFeed([]);
    setConversationHistory([]);
    setSessionComplete(false);
    setReflectionText('');

    // Deliver first step after a brief delay
    setTimeout(() => deliverStep(scenario, 0), 600);
  }, []);

  const deliverStep = useCallback(async (scenario: Scenario, stepIdx: number) => {
    if (stepIdx >= scenario.steps.length) {
      // Session complete - generate reflection
      setSessionComplete(true);
      generateReflection(scenario);
      return;
    }

    const step = scenario.steps[stepIdx];
    const persona = scenario.personas.find(p => p.id === step.persona);
    if (!persona) return;

    // Add time marker
    if (step.timeLabel) {
      addFeedItem({ type: 'time', content: step.timeLabel, timeLabel: step.timeLabel });
    }

    // Show typing indicator
    addFeedItem({ type: 'typing', content: '', persona });

    // Simulate typing delay
    await new Promise(r => setTimeout(r, 1200 + Math.random() * 800));

    // Remove typing indicator and add the actual message
    setFeed(prev => prev.filter(f => f.type !== 'typing'));

    if (step.type === 'message' || step.type === 'call') {
      // AI generates the persona's message based on the step content
      setIsLoading(true);
      const aiResponse = await callAI(
        `[SYSTEM: Deliver the following to the student as ${persona.name}. Stay in character. Adapt the content naturally but keep the core ask: "${step.content}"]`,
        persona,
        step.type
      );
      setIsLoading(false);

      addFeedItem({ type: 'message', persona, content: aiResponse, stepType: step.type });

    } else if (step.type === 'task' || step.type === 'deliverable') {
      addFeedItem({
        type: 'task',
        persona,
        content: step.content,
        stepType: step.type,
      });

    } else if (step.type === 'decision') {
      addFeedItem({ type: 'task', persona, content: step.content, stepType: 'decision' });

    } else if (step.type === 'interrupt') {
      setIsLoading(true);
      const aiResponse = await callAI(
        `[SYSTEM: This is an urgent interruption. Deliver this as ${persona.name} with urgency: "${step.content}"]`,
        persona,
        'interrupt'
      );
      setIsLoading(false);

      addFeedItem({ type: 'interrupt', persona, content: aiResponse });

    } else if (step.type === 'review') {
      addFeedItem({
        type: 'task',
        persona,
        content: step.content,
        stepType: 'review',
      });
    }

    setCurrentStepIdx(stepIdx);
  }, [addFeedItem, callAI]);

  const sendMessage = useCallback(async () => {
    const text = inputVal.trim();
    if (!text || isLoading || !selectedScenario) return;
    setInputVal('');

    // Add user message to feed
    addFeedItem({ type: 'user', content: text });

    const step = selectedScenario.steps[currentStepIdx];
    const persona = step ? selectedScenario.personas.find(p => p.id === step.persona) : selectedScenario.personas[0];
    if (!persona) return;

    // Show typing
    addFeedItem({ type: 'typing', content: '', persona });
    setIsLoading(true);

    const aiResponse = await callAI(text, persona, step?.type || 'message');

    // Remove typing, add response
    setFeed(prev => prev.filter(f => f.type !== 'typing'));
    addFeedItem({ type: 'message', persona, content: aiResponse, stepType: step?.type });
    setIsLoading(false);

    // Advance to next step after user responds
    const nextIdx = currentStepIdx + 1;
    if (nextIdx < selectedScenario.steps.length) {
      setTimeout(() => deliverStep(selectedScenario, nextIdx), 2000 + Math.random() * 1500);
    } else if (!sessionComplete) {
      setSessionComplete(true);
      setTimeout(() => generateReflection(selectedScenario), 2000);
    }
  }, [inputVal, isLoading, selectedScenario, currentStepIdx, addFeedItem, callAI, deliverStep, sessionComplete]);

  const generateReflection = useCallback(async (scenario: Scenario) => {
    const mainPersona = scenario.personas[0];

    setIsLoading(true);
    const reflection = await callAI(
      `[SYSTEM: The simulation session is now complete. As ${mainPersona.name}, provide a session-level reflection for the student. Do NOT give a numerical score. Instead, write a thoughtful debrief covering: quality of work product, speed under pressure, communication style, business judgment, and composure when interrupted. Call out 2-3 specific moments from the session. End with one piece of advice for their next session. Write in first person as ${mainPersona.name}. Keep it to 3-4 paragraphs.]`,
      mainPersona,
      'review'
    );
    setIsLoading(false);

    setReflectionText(reflection);
    setPhase('reflection');
  }, [callAI]);

  const handleKey = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendMessage(); }
  };

  const progress = selectedScenario ? ((currentStepIdx + 1) / selectedScenario.steps.length) * 100 : 0;

  // ═══ RENDER ═══

  return (
    <div className="app-layout">
      <Sidebar activePage="reps" />
      <main className="main-content" style={{ padding: '20px 32px', overflowY: 'auto' }}>

        {/* ═══ CAREER PICKER ═══ */}
        {phase === 'careers' && (
          <div style={{ maxWidth: 720, margin: '0 auto' }}>
            <div style={{ marginBottom: 8 }}>
              <div className="reps-hero-title">Reps</div>
              <div style={{ fontFamily: "'Instrument Serif', serif", fontSize: 28, letterSpacing: '-0.8px', color: 'var(--text)', marginTop: -4 }}>
                <em>Day-in-the-life simulator</em>
              </div>
            </div>
            <div className="reps-hero-sub">
              Step into the shoes of a junior professional and live a realistic workday. Not interview prep - the actual work. Pick a career to start.
            </div>

            <div className="reps-career-grid">
              {CAREERS.map(c => (
                <div
                  key={c.id}
                  className="reps-career-card"
                  onClick={() => { setSelectedCareer(c); setPhase('scenarios'); }}
                >
                  <div className="reps-career-card-title">
                    <div className="reps-career-card-dot" style={{ background: c.color }} />
                    {c.title}
                  </div>
                  <div className="reps-career-card-role">{c.subtitle}</div>
                  <div className="reps-career-card-desc">{c.description}</div>
                  <div className="reps-career-card-count">{c.scenarios.length} scenario{c.scenarios.length !== 1 ? 's' : ''} available</div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ═══ SCENARIO PICKER ═══ */}
        {phase === 'scenarios' && selectedCareer && (
          <div style={{ maxWidth: 640, margin: '0 auto' }}>
            <button className="reps-back" onClick={() => setPhase('careers')} type="button">
              <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M19 12H5"/><polyline points="12 19 5 12 12 5"/></svg>
              All careers
            </button>

            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 6 }}>
              <div style={{ width: 10, height: 10, borderRadius: '50%', background: selectedCareer.color }} />
              <div className="reps-hero-title" style={{ fontSize: 28 }}>{selectedCareer.title}</div>
            </div>
            <div className="reps-hero-sub" style={{ marginBottom: 24 }}>
              {selectedCareer.description}
            </div>

            {selectedCareer.scenarios.map(s => (
              <div key={s.id} className="reps-scenario-card" onClick={() => startSession(s)}>
                <div className="reps-scenario-title">{s.title}</div>
                <div className="reps-scenario-sub">{s.subtitle}</div>
                <div className="reps-scenario-desc">{s.description}</div>
                <div className="reps-scenario-meta">
                  <span>
                    <svg width="12" height="12" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
                    {s.duration}
                  </span>
                  <span>
                    <svg width="12" height="12" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/></svg>
                    {s.difficulty}
                  </span>
                  <span>{s.personas.length} persona{s.personas.length !== 1 ? 's' : ''}</span>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* ═══ LIVE SESSION ═══ */}
        {phase === 'session' && selectedScenario && (
          <div className="reps-session">
            <div className="reps-session-header">
              <div>
                <button className="reps-back" onClick={() => { setPhase('scenarios'); setFeed([]); setConversationHistory([]); }} type="button" style={{ marginBottom: 0 }}>
                  <svg width="12" height="12" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M19 12H5"/><polyline points="12 19 5 12 12 5"/></svg>
                  Exit
                </button>
                <div className="reps-session-title">{selectedScenario.title}</div>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <div style={{ display: 'flex', gap: 4 }}>
                  {selectedScenario.personas.map(p => (
                    <div key={p.id} title={`${p.name} - ${p.title}`} style={{ width: 24, height: 24, borderRadius: 6, background: p.color, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 8, fontWeight: 700, color: '#fff' }}>
                      {p.avatar}
                    </div>
                  ))}
                </div>
                <div className="reps-session-time">
                  {selectedScenario.steps[currentStepIdx]?.timeLabel || ''}
                </div>
              </div>
            </div>

            {/* Progress bar */}
            <div className="reps-progress">
              <div className="reps-progress-fill" style={{ width: `${progress}%`, background: selectedCareer?.color || 'var(--text)' }} />
            </div>

            {/* Feed */}
            <div className="reps-feed" ref={feedRef}>
              {feed.map(item => {
                if (item.type === 'time') {
                  return (
                    <div key={item.id} className="reps-time-marker">{item.content}</div>
                  );
                }
                if (item.type === 'typing') {
                  return (
                    <div key={item.id} className="reps-msg">
                      <div className="reps-msg-avi" style={{ background: item.persona?.color || '#666' }}>{item.persona?.avatar}</div>
                      <div className="reps-msg-body">
                        <div className="reps-msg-header">
                          <span className="reps-msg-name">{item.persona?.name}</span>
                        </div>
                        <div className="reps-typing">
                          <div className="reps-typing-dot" /><div className="reps-typing-dot" /><div className="reps-typing-dot" />
                        </div>
                      </div>
                    </div>
                  );
                }
                if (item.type === 'user') {
                  return (
                    <div key={item.id} className="reps-msg reps-user">
                      <div className="reps-msg-body">
                        <div className="reps-msg-text">{item.content}</div>
                      </div>
                    </div>
                  );
                }
                if (item.type === 'task') {
                  return (
                    <div key={item.id} className="reps-task">
                      <div className="reps-task-label">
                        {item.stepType === 'deliverable' ? 'Deliverable' : item.stepType === 'decision' ? 'Decision Point' : item.stepType === 'review' ? 'Review' : 'Your Task'}
                      </div>
                      <div className="reps-task-text">{item.content}</div>
                    </div>
                  );
                }
                if (item.type === 'interrupt') {
                  return (
                    <div key={item.id} className="reps-interrupt">
                      <div className="reps-interrupt-icon">!</div>
                      <div>
                        <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--text)', marginBottom: 4 }}>{item.persona?.name} - Urgent</div>
                        <div className="reps-interrupt-text">{item.content}</div>
                      </div>
                    </div>
                  );
                }
                // message
                return (
                  <div key={item.id} className="reps-msg">
                    <div className="reps-msg-avi" style={{ background: item.persona?.color || '#666' }}>{item.persona?.avatar}</div>
                    <div className="reps-msg-body">
                      <div className="reps-msg-header">
                        <span className="reps-msg-name">{item.persona?.name}</span>
                        <span className="reps-msg-role">{item.persona?.title}, {item.persona?.firm}</span>
                      </div>
                      <div className="reps-msg-text" dangerouslySetInnerHTML={{ __html: item.content.replace(/\n/g, '<br/>') }} />
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Input */}
            <div className="reps-input-area">
              <textarea
                ref={inputRef}
                className="reps-input"
                placeholder="Type your response..."
                rows={1}
                value={inputVal}
                onChange={e => setInputVal(e.target.value)}
                onKeyDown={handleKey}
                disabled={isLoading}
              />
              <button className="reps-send-btn" onClick={sendMessage} disabled={isLoading || !inputVal.trim()} type="button">
                <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg>
              </button>
            </div>
          </div>
        )}

        {/* ═══ REFLECTION ═══ */}
        {phase === 'reflection' && selectedScenario && (
          <div style={{ maxWidth: 640, margin: '0 auto', padding: '40px 0' }}>
            <div className="reps-complete">
              <div className="reps-complete-title">Session <em style={{ fontFamily: "'Instrument Serif', serif", fontStyle: 'italic' }}>Complete</em></div>
              <div className="reps-complete-sub">{selectedScenario.title} - {selectedCareer?.title}</div>
            </div>

            <div className="reps-review">
              <div className="reps-review-title">Session Reflection</div>
              <div className="reps-review-text" dangerouslySetInnerHTML={{ __html: reflectionText.replace(/\n/g, '<br/>') }} />
            </div>

            <div style={{ display: 'flex', gap: 12, justifyContent: 'center', marginTop: 28 }}>
              <button
                onClick={() => { setPhase('scenarios'); setFeed([]); setConversationHistory([]); }}
                type="button"
                style={{
                  padding: '12px 24px', borderRadius: 10, background: 'var(--text)', color: 'var(--surface)',
                  fontSize: 13, fontWeight: 700, border: 'none', cursor: 'pointer', fontFamily: "'Sora', sans-serif",
                }}
              >Try Another Scenario</button>
              <button
                onClick={() => setPhase('careers')}
                type="button"
                style={{
                  padding: '12px 24px', borderRadius: 10, background: 'none', color: 'var(--text-2)',
                  fontSize: 13, fontWeight: 600, border: '1.5px solid var(--border)', cursor: 'pointer', fontFamily: "'Sora', sans-serif",
                }}
              >All Careers</button>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
