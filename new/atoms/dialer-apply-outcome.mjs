/** חוט · dialer-apply-outcome — Golden. חוזה: dialer-apply-outcome.contract.md
 * מוצא: dialer.ts:46 (applyOutcome) + REQUEUE_OUTCOMES:10 (inline). חוק-4 verbatim.
 * החלת-תוצאה: רישום-יומן + קידום; לא-סופי ⇒ requeue לסוף; בלי-נוכחי ⇒ no-op. שקע: currentId (אח).
 */
export function applyOutcome(c, outcome, note, iso, { currentId }) {
  const REQUEUE_OUTCOMES = ['noanswer', 'skip'];
  const id = currentId(c);
  if (!id) return c;
  const rest = c.queue.slice(1);
  const queue = REQUEUE_OUTCOMES.includes(outcome) ? [...rest, id] : rest;
  const entry = { id, outcome, at: iso };
  if (note && note.trim()) entry.note = note.trim();
  return { ...c, queue, log: [...c.log, entry] };
}
