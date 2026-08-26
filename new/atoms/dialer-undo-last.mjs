/** חוט · dialer-undo-last — Golden. חוזה: dialer-undo-last.contract.md
 * מוצא: dialer.ts:106 (undoLast) + REQUEUE_OUTCOMES:10 (inline). חוק-4 verbatim.
 * ביטול-סיווג-אחרון: המזהה חוזר לחזית, רשומת-היומן נמחקת; requeue ⇒ מוסר מסוף-התור. טהור.
 */
export function undoLast(c) {
  const REQUEUE_OUTCOMES = ['noanswer', 'skip'];
  const last = c.log[c.log.length - 1];
  if (!last) return c;
  let queue = c.queue;
  if (REQUEUE_OUTCOMES.includes(last.outcome)) {
    const at = queue.lastIndexOf(last.id);
    queue = at >= 0 ? [...queue.slice(0, at), ...queue.slice(at + 1)] : queue;
  }
  return { ...c, queue: [last.id, ...queue], log: c.log.slice(0, -1) };
}
