'use client';
import { useState, useEffect, useRef, useCallback } from 'react';
import Sidebar from '../components/Sidebar';
import '../contact-finder/contact-finder.css';
import './game.css';
import { GAME_BANKS, MCQ } from './game-data';

const TRACKS = Object.keys(GAME_BANKS);
const TIME_LIMITS = [
  { label: '2 min blitz', seconds: 120 },
  { label: '5 min round', seconds: 300 },
  { label: '10 min session', seconds: 600 },
  { label: 'Unlimited', seconds: 0 },
];

type Phase = 'menu' | 'countdown' | 'playing' | 'results';

export default function GameModePage() {
  const [phase, setPhase] = useState<Phase>('menu');
  const [track, setTrack] = useState('Investment Banking');
  const [timeLimitIdx, setTimeLimitIdx] = useState(1);

  const [questions, setQuestions] = useState<MCQ[]>([]);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [timeLeft, setTimeLeft] = useState(0);
  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);
  const [bestStreak, setBestStreak] = useState(0);
  const [correct, setCorrect] = useState(0);
  const [wrong, setWrong] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [revealed, setRevealed] = useState(false);
  const [countdownNum, setCountdownNum] = useState(3);
  const [highScores, setHighScores] = useState<Record<string, number>>({});
  const [history, setHistory] = useState<{ q: string; correct: boolean; yourAnswer: string; rightAnswer: string }[]>([]);

  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const nextTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    try { const s = localStorage.getItem('offerbell_game_scores'); if (s) setHighScores(JSON.parse(s)); } catch {}
  }, []);

  const saveHighScore = useCallback((t: string, s: number) => {
    setHighScores(prev => {
      const next = { ...prev };
      if (!next[t] || s > next[t]) next[t] = s;
      localStorage.setItem('offerbell_game_scores', JSON.stringify(next));
      return next;
    });
  }, []);

  // Timer
  useEffect(() => {
    if (phase === 'playing' && TIME_LIMITS[timeLimitIdx].seconds > 0) {
      timerRef.current = setInterval(() => {
        setTimeLeft(t => {
          if (t <= 1) { clearInterval(timerRef.current!); return 0; }
          return t - 1;
        });
      }, 1000);
    }
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, [phase, timeLimitIdx]);

  // End game when timer hits 0
  useEffect(() => {
    if (phase === 'playing' && TIME_LIMITS[timeLimitIdx].seconds > 0 && timeLeft === 0) {
      saveHighScore(track, score);
      setPhase('results');
    }
  }, [timeLeft, phase, timeLimitIdx, track, score, saveHighScore]);

  const fmtTime = (s: number) => `${Math.floor(s / 60)}:${(s % 60).toString().padStart(2, '0')}`;

  const startGame = () => {
    const bank = GAME_BANKS[track] || GAME_BANKS['Investment Banking'];
    const shuffled = [...bank].sort(() => Math.random() - 0.5);
    setQuestions(shuffled); setCurrentIdx(0); setScore(0); setStreak(0); setBestStreak(0);
    setCorrect(0); setWrong(0); setSelected(null); setRevealed(false);
    setHistory([]); setTimeLeft(TIME_LIMITS[timeLimitIdx].seconds);
    setCountdownNum(3); setPhase('countdown');
    let count = 3;
    const iv = setInterval(() => {
      count--;
      if (count <= 0) { clearInterval(iv); setPhase('playing'); }
      else setCountdownNum(count);
    }, 600);
  };

  const handleSelect = (idx: number) => {
    if (revealed) return;
    setSelected(idx);
    setRevealed(true);
    const q = questions[currentIdx];
    const isCorrect = idx === q.correct;
    const streakBonus = isCorrect && streak >= 2 ? Math.min(streak, 5) * 5 : 0;
    const earned = isCorrect ? 10 + streakBonus : 0;

    if (isCorrect) {
      setScore(s => s + earned);
      setStreak(s => s + 1);
      setBestStreak(b => Math.max(b, streak + 1));
      setCorrect(c => c + 1);
    } else {
      setStreak(0);
      setWrong(w => w + 1);
    }

    setHistory(h => [...h, {
      q: q.q,
      correct: isCorrect,
      yourAnswer: q.choices[idx],
      rightAnswer: q.choices[q.correct],
    }]);

    // Auto advance after brief pause
    nextTimerRef.current = setTimeout(() => {
      if (currentIdx + 1 >= questions.length) {
        saveHighScore(track, score + earned);
        setPhase('results');
      } else {
        setCurrentIdx(i => i + 1);
        setSelected(null);
        setRevealed(false);
      }
    }, isCorrect ? 800 : 1800);
  };

  const endGame = () => {
    if (timerRef.current) clearInterval(timerRef.current);
    if (nextTimerRef.current) clearTimeout(nextTimerRef.current);
    saveHighScore(track, score);
    setPhase('results');
  };

  useEffect(() => { return () => { if (timerRef.current) clearInterval(timerRef.current); if (nextTimerRef.current) clearTimeout(nextTimerRef.current); }; }, []);

  const q = questions[currentIdx];
  const timeIsLow = TIME_LIMITS[timeLimitIdx].seconds > 0 && timeLeft <= 15 && timeLeft > 0;
  const total = correct + wrong;
  const accuracy = total > 0 ? Math.round(correct / total * 100) : 0;

  // ═══ MENU ═══
  if (phase === 'menu') return (
    <div className="app"><Sidebar activePage="game-mode" />
      <main className="main gm-main">
        <div className="gm-menu">
          <div className="gm-badge">⚡ Game Mode</div>
          <h1 className="gm-title">How well do you <em>really</em> know it?</h1>
          <p className="gm-sub">Pick a track. Beat the clock. Every correct answer earns points — build streaks for bonus multipliers. Questions are randomized every round.</p>

          <div className="gm-config">
            <div className="gm-field">
              <label className="gm-label">Career Track</label>
              <div className="gm-track-grid">
                {TRACKS.map(t => (
                  <button key={t} className={`gm-track-btn${track === t ? ' active' : ''}`} onClick={() => setTrack(t)} type="button">
                    <span className="gm-track-name">{t}</span>
                    <span className="gm-track-count">{GAME_BANKS[t].length} questions</span>
                    {highScores[t] != null && <span className="gm-track-best">Best: {highScores[t]}</span>}
                  </button>
                ))}
              </div>
            </div>
            <div className="gm-field">
              <label className="gm-label">Time Limit</label>
              <div className="gm-pills">{TIME_LIMITS.map((t, i) => (
                <button key={i} className={`gm-pill${timeLimitIdx === i ? ' active' : ''}`} onClick={() => setTimeLimitIdx(i)} type="button">{t.label}</button>
              ))}</div>
            </div>
          </div>

          <button className="gm-start-btn" onClick={startGame} type="button">Start Game</button>
        </div>
      </main>
    </div>
  );

  // ═══ COUNTDOWN ═══
  if (phase === 'countdown') return (
    <div className="app"><Sidebar activePage="game-mode" />
      <main className="main gm-main">
        <div className="gm-countdown">
          <div className="gm-cd-track">{track}</div>
          <div className="gm-cd-num">{countdownNum}</div>
        </div>
      </main>
    </div>
  );

  // ═══ PLAYING ═══
  if (phase === 'playing') return (
    <div className="app"><Sidebar activePage="game-mode" />
      <main className="main gm-main gm-play-main">
        <div className="gm-play">
          <div className="gm-top-bar">
            <div className="gm-top-score"><span className="gm-score-val">{score}</span><span className="gm-score-label">pts</span></div>
            {streak >= 2 && <div className="gm-streak">🔥 {streak} streak</div>}
            <div className="gm-top-tally"><span className="gm-tally-ok">{correct} ✓</span><span className="gm-tally-x">{wrong} ✗</span></div>
            {TIME_LIMITS[timeLimitIdx].seconds > 0 ? (
              <div className={`gm-timer${timeIsLow ? ' low' : ''}`}>{fmtTime(timeLeft)}</div>
            ) : (
              <div className="gm-timer">Q{total + 1}</div>
            )}
          </div>

          <div className="gm-q-area">
            <div className="gm-q-cat">{q?.cat}</div>
            <div className="gm-q-text">{q?.q}</div>

            <div className="gm-choices">
              {q?.choices.map((c, i) => {
                let cls = 'gm-choice';
                if (revealed) {
                  if (i === q.correct) cls += ' correct';
                  else if (i === selected && i !== q.correct) cls += ' wrong';
                  else cls += ' faded';
                }
                return (
                  <button key={i} className={cls} onClick={() => handleSelect(i)} type="button" disabled={revealed}>
                    <span className="gm-choice-letter">{'ABCD'[i]}</span>
                    <span className="gm-choice-text">{c}</span>
                    {revealed && i === q.correct && <span className="gm-choice-check">✓</span>}
                    {revealed && i === selected && i !== q.correct && <span className="gm-choice-x">✗</span>}
                  </button>
                );
              })}
            </div>

            {revealed && selected === q?.correct && (
              <div className="gm-feedback correct-fb">
                Correct!{streak >= 2 ? ` 🔥 ${streak} streak — +${Math.min(streak, 5) * 5} bonus` : ''} <span>+{10 + (streak >= 2 ? Math.min(streak, 5) * 5 : 0)}</span>
              </div>
            )}
            {revealed && selected !== q?.correct && (
              <div className="gm-feedback wrong-fb">
                The correct answer is <strong>{q?.choices[q?.correct]}</strong>
              </div>
            )}
          </div>

          <div className="gm-bottom-bar">
            <button className="gm-end-btn" onClick={endGame} type="button">End Game</button>
          </div>
        </div>
      </main>
    </div>
  );

  // ═══ RESULTS ═══
  const isNewHS = highScores[track] != null && score >= highScores[track] && score > 0;

  return (
    <div className="app"><Sidebar activePage="game-mode" />
      <main className="main gm-main">
        <div className="gm-results">
          {isNewHS && <div className="gm-new-hs">🏆 New High Score!</div>}
          <h2 className="gm-results-title">Game <em>Over</em></h2>
          <div className="gm-results-track">{track}</div>

          <div className="gm-final-score"><div className="gm-final-num">{score}</div><div className="gm-final-label">points</div></div>

          <div className="gm-stats-grid">
            <div className="gm-stat-card"><div className="gm-stat-val">{total}</div><div className="gm-stat-lbl">Answered</div></div>
            <div className="gm-stat-card"><div className="gm-stat-val" style={{color:'#16a34a'}}>{correct}</div><div className="gm-stat-lbl">Correct</div></div>
            <div className="gm-stat-card"><div className="gm-stat-val" style={{color:'#dc2626'}}>{wrong}</div><div className="gm-stat-lbl">Wrong</div></div>
            <div className="gm-stat-card"><div className="gm-stat-val">{accuracy}%</div><div className="gm-stat-lbl">Accuracy</div></div>
            <div className="gm-stat-card"><div className="gm-stat-val">🔥 {bestStreak}</div><div className="gm-stat-lbl">Best Streak</div></div>
            <div className="gm-stat-card"><div className="gm-stat-val">{total > 0 ? (score / total).toFixed(1) : '0'}</div><div className="gm-stat-lbl">Avg Pts/Q</div></div>
          </div>

          {history.length > 0 && (
            <div className="gm-review">
              <div className="gm-review-title">Review</div>
              <div className="gm-review-list">
                {history.map((h, i) => (
                  <div key={i} className={`gm-review-row ${h.correct ? 'correct' : 'wrong'}`}>
                    <div className={`gm-review-badge ${h.correct ? 'correct' : 'wrong'}`}>{h.correct ? '✓' : '✗'}</div>
                    <div className="gm-review-content">
                      <div className="gm-review-q">{h.q}</div>
                      {!h.correct && <div className="gm-review-answer">Your answer: {h.yourAnswer}<br/>Correct: <strong>{h.rightAnswer}</strong></div>}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="gm-results-actions">
            <button className="gm-retry-btn" onClick={startGame} type="button">Play Again</button>
            <button className="gm-menu-btn" onClick={() => setPhase('menu')} type="button">Change Track</button>
          </div>
        </div>
      </main>
    </div>
  );
}
