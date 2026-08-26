/** חוט · dialer-progress — Golden. חוזה: dialer-progress.contract.md
 * מוצא: dialer.ts:80 (progress) + REQUEUE_OUTCOMES:10 + ZERO_COUNTS:66 (inline). חוק-4 verbatim.
 * מדד-התקדמות: לא-ענה/דלג נספרים פר-אדם (ייחודי); שאר פר-ניסיון. טהור.
 */
export function progress(c) {
  const REQUEUE_OUTCOMES = ['noanswer', 'skip'];
  const counts = { donated: 0, noanswer: 0, refused: 0, callback: 0, done: 0, skip: 0 };
  const pending = new Set(c.queue);
  const remaining = pending.size;
  const seen = {};
  for (const e of c.log) {
    if (REQUEUE_OUTCOMES.includes(e.outcome)) {
      const s = (seen[e.outcome] ??= new Set());
      if (s.has(e.id)) continue;
      s.add(e.id);
    }
    counts[e.outcome]++;
  }
  return { total: c.total, remaining, finalized: Math.max(0, c.total - remaining), counts };
}
