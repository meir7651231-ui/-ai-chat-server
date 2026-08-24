/** חוט · mat-cost-total — עלות-החומרים: סכום (כמות × מחיר-יחידה) של רשומות-החומרים.
 *  חוזה: mat-cost-total.contract.md
 *  חולץ כלשונו מ-maor/src/lib/ayin.ts:114-116 (תורגם TS→JS). טהור, אפס שקעים. */
export function matCostTotal(a) {
  return (a.mat || []).reduce((t, m) => t + (+m.qty || 0) * (+m.cost || 0), 0);
}
