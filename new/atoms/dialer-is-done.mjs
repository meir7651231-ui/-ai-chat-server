/** חוט · dialer-is-done — Golden. חוזה: dialer-is-done.contract.md
 * מוצא: dialer.ts:97 (isDone). חוק-4 verbatim. האם התור ריק. טהור.
 */
export function isDone(c) {
  return c.queue.length === 0;
}
