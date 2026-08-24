/** חוט · pending-makeups — חיסורים-זכאים-להשלמה (makeup===true), אופציונלית פר-חוג.
 *  חוזה: pending-makeups.contract.md · טהור, אפס-שקעים.
 *  חולץ כלשונו מ-maor/src/components/courses/lib.ts:354-367. */
export function pendingMakeups(enrollments, courseId) {
  const out = [];
  for (const e of enrollments) {
    if (e.status === 'ended' || e.status === 'wait') continue;
    if (courseId && e.courseId !== courseId) continue;
    for (const a of e.absences) {
      if (!a.makeup) continue;
      out.push({ enrollmentId: e.id, memberId: e.memberId, courseId: e.courseId, date: a.date, reason: a.reason, makeupDate: a.makeupDate });
    }
  }
  return out.sort((x, y) => (x.makeupDate ? 1 : 0) - (y.makeupDate ? 1 : 0) || x.date.localeCompare(y.date));
}
