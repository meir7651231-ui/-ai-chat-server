/** חוט · default-course-dates — טווח-ברירת-מחדל לחוג = שנה"ל הנוכחית (1.9–31.7). חוזה: default-course-dates.contract.md
 *  חולץ כלשונו מ-maor/src/components/courses/lib.ts:32-46; השכן isoTodayLocal
 *  (ברירת-מחדל-הפרמטר) הוסר — today מוזרק ע"י הקופסה (חוק-1 — אפס import פנימי). */
export function defaultCourseDates(today) {
  const d = new Date(today.slice(0, 10) + 'T12:00:00');
  const y = isNaN(d.getTime()) ? new Date().getFullYear() : d.getFullYear();
  const m = isNaN(d.getTime()) ? new Date().getMonth() : d.getMonth(); // 0-based; 7 = אוגוסט
  // שנת-הלימודים פותחת ב-1.9. באוגוסט ואילך (m>=7) פותחים את השנה שמתחילה השנה;
  // בספטמבר–יולי אנחנו בתוך השנה שנפתחה בספטמבר הקודם.
  const startYear = m >= 7 ? y : y - 1;
  return { start: `${startYear}-09-01`, end: `${startYear + 1}-07-31` };
}
