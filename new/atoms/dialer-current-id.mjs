/** חוט · dialer-current-id — Golden. חוזה: dialer-current-id.contract.md
 * מוצא: dialer.ts:37 (currentId). חוק-4 verbatim. חזית-התור או null. טהור.
 */
export function currentId(c) {
  return c.queue.length ? c.queue[0] : null;
}
