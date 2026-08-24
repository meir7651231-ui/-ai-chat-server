/** חוט · enrollments-for-session — המשובצים למפגש ביומן. חוזה: enrollments-for-session.contract.md
 *  חולץ כלשונו מ-maor/src/components/diary/lib.ts:228-236; השכנים sessionsOf
 *  ו-groupLabelOf הוזרקו כשקעים (חוק-1 — אפס import פנימי). */
export function enrollmentsForSession(db, c, sessionIndex, sessionsOf, groupLabelOf) {
  const all = db.enrollments.filter((e) => e.courseId === c.id);
  const ss = sessionsOf(c);
  if (ss.length <= 1) return all;
  const label = groupLabelOf(ss[Math.min(sessionIndex, ss.length - 1)], sessionIndex);
  return all.filter((e) => !e.group || e.group === label);
}
