/** חוט · iso-today — "היום" כ-ISO מקומי (YYYY-MM-DD). חוזה: iso-today.contract.md
 *  מוצא: maor/src/lib/date-util.ts:9-13; היה מועתק כעטיפה ב-5 מודולים
 *  (courses/diary/families/reports/supporters) — אוחד לעותק-יחיד.
 *  שקע (חוק-1): isoLocal — השכן Date⇒"YYYY-MM-DD" מוזרק, לא מיובא. */
export function isoToday(isoLocal, now = new Date()) {
  return isoLocal(now);
}
