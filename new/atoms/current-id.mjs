/** חוט · current-id — חזית תור-הקמפיין או null. חוזה: current-id.contract.md
 *  חולץ כלשונו מ-maor/src/lib/dialer.ts:37-39 (אפס שכנים — אפס שקעים). */
export function currentId(c) {
  return c.queue.length ? c.queue[0] : null;
}
