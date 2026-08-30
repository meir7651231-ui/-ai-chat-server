/** חוט · cockpit-csv-rows — Golden. חוזה: cockpit-csv-rows.contract.md
 * מוצא: cockpit.ts:281 (cockpitCsvRows) + KIND_LABEL:277 (הוטבע inline). טהור. חוק-4 verbatim.
 * שורות-CSV של תור-המשימות (כותרת + שורה למשימה).
 */
export function cockpitCsvRows(queue, T) {
  const KIND_LABEL = { call: T.k1, thanks: T.k2, hok: T.k3 };
  return [
    [T.k4, T.k5, T.k6, T.k7],
    ...queue.tasks.map((t) => [KIND_LABEL[t.kind], t.name, t.phone, t.reason]),
  ];
}
