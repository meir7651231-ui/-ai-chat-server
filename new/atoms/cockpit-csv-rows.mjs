/** חוט · cockpit-csv-rows — Golden. חוזה: cockpit-csv-rows.contract.md
 * מוצא: cockpit.ts:281 (cockpitCsvRows) + KIND_LABEL:277 (הוטבע inline). טהור. חוק-4 verbatim.
 * שורות-CSV של תור-המשימות (כותרת + שורה למשימה).
 */
export function cockpitCsvRows(queue) {
  const KIND_LABEL = { call: 'שיחה', thanks: 'תודה', hok: 'הו״ק' };
  return [
    ['קבוצה', 'שם', 'טלפון', 'סיבה'],
    ...queue.tasks.map((t) => [KIND_LABEL[t.kind], t.name, t.phone, t.reason]),
  ];
}
