/** חוט · next-year-course-draft — טיוטת-חוג טהורה לשנה הבאה (רישום-לשנה-הבאה).
 *  חוזה: next-year-course-draft.contract.md
 *  חולץ כלשונו מ-maor/src/components/courses/reenroll-lib.ts:243-254; השכנים
 *  nextYearDates (הזזת-תאריכים) ו-academicYearLabel (תווית-שנה"ל) הוזרקו כשקעים
 *  (חוק-1 — אפס import פנימי). ה-id מוזרק מבחוץ; החוג הישן לא נגע. */
export function nextYearCourseDraft(src, newId, nextYearDates, academicYearLabel) {
  const { start, end } = nextYearDates(src.start, src.end);
  return {
    ...src,
    id: newId,
    start,
    end,
    year: academicYearLabel(start),
    prevYearId: src.id,
  };
}
