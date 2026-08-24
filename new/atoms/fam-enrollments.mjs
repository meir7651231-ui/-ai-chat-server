/** חוט · fam-enrollments — כל שיבוצי בני-המשפחה (כולל ended/wait). חוזה: fam-enrollments.contract.md
 *  חולץ כלשונו מ-maor/src/components/families/lib.ts:69-78. טהור, אפס שקעים. */
export function famEnrollments(db, fam) {
  const ids = new Set(fam.members.map((m) => m.id));
  return db.enrollments.filter((e) => ids.has(e.memberId));
}
