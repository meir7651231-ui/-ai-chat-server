/** חוט · schedule-clash-text — אזהרת התנגשות-לו"ז: מפגשי חוג-היעד מול מפגשי
 *  השיבוצים הפעילים של הילד/ה (אותו יום + אותה שעה). מייעץ — לא חוסם.
 *  חוזה: schedule-clash-text.contract.md
 *  חולץ כלשונו מ-maor/src/components/courses/lib.ts:497-516; השכנים sessionsOf
 *  ו-DAY_NAMES הוזרקו כשקעים (חוק-1; ברירת-מחדל dayNames = ערך-המוצא). */
export function scheduleClashText(
  db,
  memberId,
  course,
  sessionsOf,
  dayNames = ['ראשון', 'שני', 'שלישי', 'רביעי', 'חמישי', 'שישי'], T) {
  const target = sessionsOf(course);
  for (const e of db.enrollments) {
    if (e.memberId !== memberId || e.status === T.k1 || e.courseId === course.id) continue;
    const other = db.courses.find((x) => x.id === e.courseId);
    if (!other) continue;
    for (const s1 of target) {
      for (const s2 of sessionsOf(other)) {
        if (s1.day === s2.day && !!s1.time && s1.time === s2.time) {
          return T.k2 + other.name + T.k3 + dayNames[s1.day] + ' ' + s1.time;
        }
      }
    }
  }
  return null;
}
