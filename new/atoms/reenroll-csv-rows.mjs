/** חוט · reenroll-csv-rows — שורות-CSV לרשימת-הרישום-מחדש (כותרת + נתונים).
 *  חוזה: reenroll-csv-rows.contract.md · בלי שקעים (טהור-מלא).
 *  חולץ כלשונו מ-maor/src/components/courses/reenroll-lib.ts:319-337. */
export function reenrollCsvRows(rows, head, T) {
  const decWord = (d) => (d === T.k1 ? T.k2 : d === 'no' ? T.k3 : d === T.k4 ? T.k5 : '');
  const body = rows.map((r) => [
    r.memberName,
    r.familyName,
    r.courseName,
    String(r.summary.presents),
    String(r.summary.absences),
    String(r.summary.balance),
    r.summary.statusLabel,
    decWord(r.decision),
    r.renewed ? T.k6 : '',
    r.e.renewNote ?? '',
  ]);
  return [head, ...body];
}
