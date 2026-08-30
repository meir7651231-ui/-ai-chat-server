/** חוט · fresh-next-year-enrollment — טיוטת-שיבוץ לשנה הבאה (איפוס-היסטוריה).
 *  חוזה: fresh-next-year-enrollment.contract.md
 *  חולץ כלשונו מ-maor/src/components/courses/reenroll-lib.ts:207-242. */
export function freshNextYearEnrollment(src, targetCourseId, newId, todayIso, groupOverride, T) {
  return {
    id: newId,
    memberId: src.memberId,
    courseId: targetCourseId,
    plan: src.plan,
    purchased: 0,
    used: 0,
    // ‏groupOverride: מנהל-העבודה בחר קבוצה ברישום. undefined ⇒ אותה קבוצה של אשתקד.
    group: groupOverride ?? src.group,
    absences: [],
    payments: [],
    totalDue: src.totalDue,
    dueDate: '',
    status: T.k1,
    note: '',
    enrolledAt: todayIso,
    // תמחור משוקלל — נשמר כדי שהמחיר יעבור לשנה הבאה כמו שהיה.
    ...(src.freq !== undefined ? { freq: src.freq } : {}),
    ...(src.freqUnit !== undefined ? { freqUnit: src.freqUnit } : {}),
    ...(src.term !== undefined ? { term: src.term } : {}),
    ...(src.termMonths !== undefined ? { termMonths: src.termMonths } : {}),
    ...(src.tier !== undefined ? { tier: src.tier } : {}),
  };
}
