/* ═══════════════════════════════════════════════════════════════════════════
   Computed relationship warmth.

   A recruiting-specific warmth score, blended from three signals. The point of
   difference versus a generic contact tool: PROGRESS is funnel-aware. A contact
   who replied and took a call reads warm even after a quiet week; a contact
   chased three times into silence reads cold no matter how recently you emailed.
   Frequency-only scoring cannot tell those two apart. This can.

   Nothing here is user-entered. It is derived from status + timestamps the
   tracker already stores, so it updates itself as the relationship moves.
   ═══════════════════════════════════════════════════════════════════════════ */

export type WarmthBand = 'warm' | 'neutral' | 'cold';
export type Warmth = { score: number; band: WarmthBand };

const DAY = 864e5;

// 1. PROGRESS - position in the recruiting funnel. This is the recruiting signal.
//    Note fu1 > fu2 > fu3: each unanswered chase is evidence the relationship is
//    NOT converting, so progress bleeds as the follow-ups stack.
const PROGRESS: Record<string, number> = {
  drafted: 5,     // not sent yet
  noresp: 10,     // explicitly went nowhere
  sent: 30,       // out, awaiting first reply
  fu1: 35, fu2: 30, fu3: 20,
  scheduled: 80,  // a call is booked
  spoken: 90,     // you have actually talked
  stay: 75,       // established relationship, maintenance
};

// 2. RECENCY - decay since last contact.
function recency(daysSince: number | null): number {
  if (daysSince === null) return 0;
  if (daysSince <= 3) return 100;
  if (daysSince <= 7) return 85;
  if (daysSince <= 14) return 65;
  if (daysSince <= 30) return 40;
  if (daysSince <= 60) return 20;
  return 8;
}

// 3. MOMENTUM - is it moving forward or stalling. Replies and calls are positive;
//    stacked follow-ups with no status change are negative.
function momentum(status: string): number {
  if (status === 'scheduled' || status === 'spoken') return 100;
  if (status === 'stay') return 70;
  if (status === 'noresp') return 5;
  if (status === 'sent') return 60;
  if (status === 'fu1') return 45;
  if (status === 'fu2') return 30;
  if (status === 'fu3') return 15;
  return 30;
}

export function computeWarmth(input: { status: string; lastContact: number | null }): Warmth {
  const daysSince = input.lastContact ? Math.floor((Date.now() - input.lastContact) / DAY) : null;
  const p = PROGRESS[input.status] ?? 30;
  const r = recency(daysSince);
  const m = momentum(input.status);

  // For maintenance statuses (talked / staying in touch) recency leads, because a
  // warm relationship genuinely cools with silence. In the active funnel, progress
  // leads. This is what makes an old 'stay' contact correctly drift toward cold.
  const maintenance = input.status === 'stay' || input.status === 'spoken';
  const score = maintenance
    ? Math.round(p * 0.35 + r * 0.45 + m * 0.20)
    : Math.round(p * 0.45 + r * 0.30 + m * 0.25);

  const band: WarmthBand = score >= 66 ? 'warm' : score >= 36 ? 'neutral' : 'cold';
  return { score, band };
}

export const WARMTH_COLOR: Record<WarmthBand, string> = {
  warm: '#3a7d5c',
  neutral: '#b4864a',
  cold: '#c0392b',
};

export const WARMTH_LABEL: Record<WarmthBand, string> = {
  warm: 'Warm',
  neutral: 'Neutral',
  cold: 'Cold',
};
