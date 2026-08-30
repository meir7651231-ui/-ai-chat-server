/** חוט · reenroll-list-text — טקסט-תדפיס קריא לרשימת-הרישום-מחדש (שורה לתלמיד/ה).
 *  חוזה: reenroll-list-text.contract.md · בלי שקעים (טהור-מלא).
 *  חולץ כלשונו מ-maor/src/components/courses/reenroll-lib.ts:338-344. */
export function reenrollListText(rows, T) {
  const decWord = (d) => (d === T.k1 ? T.k2 : d === 'no' ? T.k3 : d === T.k4 ? T.k5 : T.k6);
  return rows
    .map((r) => `${r.memberName} · ${r.courseName} — נוכחות ${r.summary.presents}, חיסורים ${r.summary.absences} · ${decWord(r.decision)}${r.renewed ? ' ✓נרשם' : ''}`)
    .join('\n');
}
