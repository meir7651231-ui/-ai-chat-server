/** חוט · warehouse-value — ערך-מלאי כולל (Σ qty×cost) למדד-מחסן.
 *  חוזה: warehouse-value.contract.md
 *  חולץ כלשונו מ-maor/src/lib/warehouse.ts:69-71 — טהור, אפס שקעים. */
export function warehouseValue(warehouse) {
  return Math.round(warehouse.reduce((a, w) => a + (+w.qty || 0) * (+w.cost || 0), 0));
}
