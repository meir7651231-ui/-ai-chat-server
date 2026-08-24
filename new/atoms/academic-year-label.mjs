/** חוט · academic-year-label — תווית שנה"ל מתאריך-פתיחה (1.9). חוזה: academic-year-label.contract.md
 *  חולץ כלשונו מ-maor/src/components/courses/reenroll-lib.ts:26-32; השכן atNoon
 *  (פרסור-צהריים) הוזרק כשקע (חוק-1 — אפס import פנימי). */
export function academicYearLabel(startIso, atNoon) {
  const d = atNoon(startIso);
  const y = d.getFullYear();
  const startYear = d.getMonth() >= 8 ? y : y - 1; // ספט׳=8
  const nn = String((startYear + 1) % 100).padStart(2, '0');
  return `${startYear}/${nn}`;
}
