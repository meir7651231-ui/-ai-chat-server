/** חוט · eyes-total — סכום מוני-הפריטים (eyes) של תיק-עין. חוזה: eyes-total.contract.md
 *  חולץ כלשונו מ-maor/src/lib/ayin.ts:86-93. טהור, אפס שקעים. */
export function eyesTotal(a) {
  return a.names.reduce((t, x) => t + (+x.eyes || 0), 0);
}
