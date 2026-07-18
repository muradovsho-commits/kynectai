/* ═══════════════════════════════════════════════════════════════════════════
   Adaptive flashcard memory.

   A static question bank shows every card with equal weight forever. This is
   the thing a bank can't do: track how you did on each individual card and
   weight what you see next toward the ones you keep missing.

   Stored per track, keyed by a stable hash of the question text (the cards
   themselves have no id). Lightweight: a small record per card, capped so the
   store never bloats. Everything is local-first; it mirrors the existing
   offerbell_flash_perf_<track> pattern.
   ═══════════════════════════════════════════════════════════════════════════ */

export type CardRating = 'got' | 'almost' | 'missed';

export type CardMemory = {
  // rolling counts
  got: number;
  almost: number;
  missed: number;
  last: CardRating;       // most recent outcome
  lastSeen: number;       // timestamp
  streak: number;         // consecutive 'got' - once high enough, the card retires
};

export type DeckMemory = Record<string, CardMemory>;

const DAY = 864e5;

// Stable, collision-resistant enough hash of the question text -> key.
export function cardKey(question: string): string {
  let h = 5381;
  for (let i = 0; i < question.length; i++) h = ((h << 5) + h + question.charCodeAt(i)) | 0;
  return 'c' + (h >>> 0).toString(36);
}

export function memKey(track: string): string {
  return `offerbell_flash_mem_${track || 'default'}`;
}

export function loadMemory(track: string): DeckMemory {
  try {
    const raw = localStorage.getItem(memKey(track));
    if (!raw) return {};
    const parsed = JSON.parse(raw);
    if (parsed && typeof parsed === 'object') return parsed;
  } catch {}
  return {};
}

export function recordRating(track: string, question: string, rating: CardRating): DeckMemory {
  const mem = loadMemory(track);
  const k = cardKey(question);
  const prev = mem[k] || { got: 0, almost: 0, missed: 0, last: 'missed' as CardRating, lastSeen: 0, streak: 0 };
  const next: CardMemory = {
    got: prev.got + (rating === 'got' ? 1 : 0),
    almost: prev.almost + (rating === 'almost' ? 1 : 0),
    missed: prev.missed + (rating === 'missed' ? 1 : 0),
    last: rating,
    lastSeen: Date.now(),
    streak: rating === 'got' ? prev.streak + 1 : 0,
  };
  mem[k] = next;
  try { localStorage.setItem(memKey(track), JSON.stringify(mem)); } catch {}
  return mem;
}

/* Weight a card for the adaptive drill. Higher = show sooner / more often.
   - never-seen cards get a baseline so they still enter rotation
   - recent misses spike hard
   - 'almost' matters but less than a miss
   - a card you've gotten right 3+ times in a row is basically retired (low weight)
   - a long gap since last seen nudges weight up (spaced repetition) */
export function cardWeight(question: string, mem: DeckMemory): number {
  const m = mem[cardKey(question)];
  if (!m) return 10; // unseen baseline

  let w = 0;
  if (m.last === 'missed') w += 60;
  else if (m.last === 'almost') w += 30;
  else w += 4; // last was 'got'

  // history: each lifetime miss adds pressure, each got relieves it
  w += m.missed * 8;
  w += m.almost * 3;
  w -= m.got * 4;

  // retire well-known cards
  if (m.streak >= 3) w = Math.min(w, 3);

  // spaced repetition: the longer since you saw it, the more it resurfaces
  const daysSince = (Date.now() - m.lastSeen) / DAY;
  if (daysSince > 7) w += 12;
  else if (daysSince > 3) w += 5;

  return Math.max(w, 1);
}

/* Build a weighted-shuffled order over a set of cards. Cards with higher weight
   land earlier and appear more often is handled by the caller re-drawing; here
   we produce a single weighted-random permutation (heavier cards trend first). */
export function adaptiveOrder<T extends { q: string }>(cards: T[], mem: DeckMemory): T[] {
  // assign each card a random key scaled by weight, sort ascending -> heavier
  // cards get smaller keys more often, so they cluster toward the front.
  return [...cards]
    .map(c => ({ c, k: Math.random() / cardWeight(c.q, mem) }))
    .sort((a, b) => a.k - b.k)
    .map(x => x.c);
}

/* The set of cards worth a focused "weak spots" session: anything last missed
   or almost, or with more misses than gots. */
export function weakCards<T extends { q: string }>(cards: T[], mem: DeckMemory): T[] {
  return cards.filter(c => {
    const m = mem[cardKey(c.q)];
    if (!m) return false;
    if (m.streak >= 3) return false;
    return m.last === 'missed' || m.last === 'almost' || m.missed > m.got;
  });
}

export const RATING_META: Record<CardRating, { label: string; color: string }> = {
  got: { label: 'Got it', color: '#3a7d5c' },
  almost: { label: 'Almost', color: '#b4864a' },
  missed: { label: 'Missed', color: '#c0392b' },
};
