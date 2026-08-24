/** חוט · apply-outcome — החלת תוצאת-שיחה על חזית-תור הקמפיין. חוזה: apply-outcome.contract.md
 *  חולץ כלשונו מ-maor/src/lib/dialer.ts:46-55; השכנים currentId/REQUEUE_OUTCOMES
 *  הוזרקו כשקעים (חוק-1 — אפס import פנימי). */
export function applyOutcome(c, outcome, note, iso, currentId, requeueOutcomes) {
  const id = currentId(c);
  if (!id) return c;
  const rest = c.queue.slice(1);
  const queue = requeueOutcomes.includes(outcome) ? [...rest, id] : rest;
  const entry = { id, outcome, at: iso };
  if (note && note.trim()) entry.note = note.trim();
  return { ...c, queue, log: [...c.log, entry] };
}
