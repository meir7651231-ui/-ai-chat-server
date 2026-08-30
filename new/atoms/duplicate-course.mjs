/** חוט · duplicate-course — שכפול-חוג לסמסטר-חדש (id/תאריכים חדשים, שם "(עותק)").
 *  חוזה: duplicate-course.contract.md
 *  חולץ כלשונו מ-maor/src/components/courses/lib.ts:340-343. */
export function duplicateCourse(c, newId, dates, T) {
  return { ...c, id: newId, name: c.name + T.k1, start: dates.start, end: dates.end };
}
