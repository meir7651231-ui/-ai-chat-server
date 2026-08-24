/** חוט · student-history — היסטוריית-ההשתתפויות של תלמיד/ה, מהחדש לישן.
 *  חוזה: student-history.contract.md
 *  חולץ כלשונו מ-maor/src/components/courses/reenroll-lib.ts:279-305; השכנים
 *  academicYearLabel ו-enrollSummary הוזרקו כשקעים (חוק-1 — אפס import פנימי). */
export function studentHistory(db, memberId, academicYearLabel, enrollSummary) {
  // מזהי-שיבוצים שמישהו התחדש אליהם (יעד-רישום) — לזיהוי fromRenewal.
  const renewTargetIds = new Set(db.enrollments.map((e) => e.renewedToId).filter(Boolean));
  const out = [];
  for (const e of db.enrollments) {
    if (e.memberId !== memberId) continue;
    const course = db.courses.find((c) => c.id === e.courseId) ?? null;
    const start = course?.start ?? '';
    out.push({
      enrollment: e,
      courseId: e.courseId,
      courseName: course?.name ?? '—',
      group: e.group || '',
      yearLabel: course?.year || (start ? academicYearLabel(start) : ''),
      start,
      end: course?.end ?? '',
      summary: enrollSummary(e),
      fromRenewal: renewTargetIds.has(e.id),
      renewedForward: !!e.renewedToId,
    });
  }
  // מהחדש לישן — תאריך-פתיחת-החוג יורד, ואז enrolledAt יורד.
  out.sort((a, b) => (b.start || '').localeCompare(a.start || '') || (b.enrollment.enrolledAt || '').localeCompare(a.enrollment.enrolledAt || ''));
  return out;
}
