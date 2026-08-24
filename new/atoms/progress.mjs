/** חוט · progress — מדד-התקדמות של קמפיין-חיוג. חוזה: progress.contract.md
 *  חולץ כלשונו מ-maor/src/lib/dialer.ts:80-96; השכן REQUEUE_OUTCOMES הוזרק
 *  כשקע (חוק-1 — אפס import פנימי); ZERO_COUNTS הפרטי הוטמע. */
const ZERO_COUNTS = () => ({ donated: 0, noanswer: 0, refused: 0, callback: 0, done: 0, skip: 0 });
export function progress(c, requeueOutcomes) {
  const pending = new Set(c.queue);
  const remaining = pending.size;
  const counts = ZERO_COUNTS();
  const seen = {};
  for (const e of c.log) {
    if (requeueOutcomes.includes(e.outcome)) {
      const s = (seen[e.outcome] ??= new Set());
      if (s.has(e.id)) continue;
      s.add(e.id);
    }
    counts[e.outcome]++;
  }
  return { total: c.total, remaining, finalized: Math.max(0, c.total - remaining), counts };
}
