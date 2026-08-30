/** חוט · cockpit-days-since — קודם אוטומטית (אפיון-Golden). חוזה: cockpit-days-since.contract.md
 * מוצא: maor-system/src/components/supporters/cockpit.ts:42 (daysSince) + MS_DAY:39 (הוטבע inline).
 * ימים בין תאריך-ISO ליום (חיובי = בעבר). Infinity לתאריך ריק/לא-תקין. חוק-4: verbatim מהמקור.
 */
export function cockpitDaysSince(iso, todayIso, T) {
  const MS_DAY = T.k1;
  if (!iso) return Infinity;
  const t = new Date(iso + 'T12:00:00').getTime();
  const now = new Date(todayIso + 'T12:00:00').getTime();
  if (Number.isNaN(t) || Number.isNaN(now)) return Infinity;
  return Math.floor((now - t) / MS_DAY);
}
