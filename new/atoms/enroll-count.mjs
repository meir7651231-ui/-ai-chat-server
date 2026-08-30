/** חוט · enroll-count — משובצים תופסי-מקום בחוג (לא 'ended', לא 'wait'). חוזה: enroll-count.contract.md
 *  חולץ כלשונו מ-maor/src/components/courses/lib.ts:333-339. טהור — אפס שקעים. */
export function enrollCount(db, courseId, T) {
  // 'wait' (רשימת-המתנה) אינו תופס מקום — אחרת רשימת-המתנה הייתה חוסמת שיבוץ אמיתי.
  return db.enrollments.filter((e) => e.courseId === courseId && e.status !== T.k1 && e.status !== T.k2).length;
}
