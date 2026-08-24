/** חוט · reenroll-list-text — טקסט-תדפיס קריא לרשימת-הרישום-מחדש (שורה לתלמיד/ה).
 *  חוזה: reenroll-list-text.contract.md · בלי שקעים (טהור-מלא).
 *  חולץ כלשונו מ-maor/src/components/courses/reenroll-lib.ts:338-344. */
export function reenrollListText(rows) {
  const decWord = (d) => (d === 'yes' ? 'ממשיך' : d === 'no' ? 'לא ממשיך' : d === 'hold' ? 'בהמתנה' : 'טרם הוחלט');
  return rows
    .map((r) => `${r.memberName} · ${r.courseName} — נוכחות ${r.summary.presents}, חיסורים ${r.summary.absences} · ${decWord(r.decision)}${r.renewed ? ' ✓נרשם' : ''}`)
    .join('\n');
}
