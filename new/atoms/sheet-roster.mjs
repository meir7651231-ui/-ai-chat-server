/** חוט · sheet-roster — גיליון-נוכחות: שיבוצי-החוג הפעילים/המוקפאים (לא ended, לא wait).
 *  חוזה: sheet-roster.contract.md
 *  חולץ כלשונו מ-maor/src/components/courses/lib.ts:391-395. */
export function sheetRoster(enrollments, courseId, T) {
    return enrollments.filter((e) => e.courseId === courseId && e.status !== T.k1 && e.status !== T.k2);
}
