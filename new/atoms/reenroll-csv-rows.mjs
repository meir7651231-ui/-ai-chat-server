/** חוט · reenroll-csv-rows — שורות-CSV לרשימת-הרישום-מחדש (כותרת + נתונים).
 *  חוזה: reenroll-csv-rows.contract.md · בלי שקעים (טהור-מלא).
 *  חולץ כלשונו מ-maor/src/components/courses/reenroll-lib.ts:319-337. */
export function reenrollCsvRows(rows) {
  const head = ['תלמיד/ה', 'משפחה', 'חוג', 'נוכחות', 'חיסורים', 'יתרה ₪', 'סטטוס', 'החלטה', 'נרשם לשנה הבאה', 'הערה'];
  const decWord = (d) => (d === 'yes' ? 'ממשיך' : d === 'no' ? 'לא ממשיך' : d === 'hold' ? 'בהמתנה' : '');
  const body = rows.map((r) => [
    r.memberName,
    r.familyName,
    r.courseName,
    String(r.summary.presents),
    String(r.summary.absences),
    String(r.summary.balance),
    r.summary.statusLabel,
    decWord(r.decision),
    r.renewed ? 'כן' : '',
    r.e.renewNote ?? '',
  ]);
  return [head, ...body];
}
