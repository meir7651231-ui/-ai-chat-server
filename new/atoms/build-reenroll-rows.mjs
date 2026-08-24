/** חוט · build-reenroll-rows — שורות מסך רישום-לשנה-הבאה. חוזה: build-reenroll-rows.contract.md
 *  חולץ כלשונו מ-maor/src/components/courses/reenroll-lib.ts:134-183; ארבעת השכנים
 *  (isRenewed · renewOf · enrollSummary · findMember) הוזרקו כשקעים (חוק-1). */
export function buildReenrollRows(db, filter, { isRenewed, renewOf, enrollSummary, findMember }) {
  filter = filter ?? {};
  const includeRenewed = filter.includeRenewed !== false;
  const q = (filter.q ?? '').trim();
  const rows = [];
  for (const e of db.enrollments) {
    if (filter.courseId && e.courseId !== filter.courseId) continue;
    const renewed = isRenewed(e);
    if (!includeRenewed && renewed) continue;
    const course = db.courses.find((c) => c.id === e.courseId) ?? null;
    const { member, family } = findMember(db, e.memberId);
    const memberName = member?.first ?? '';
    const courseName = course?.name ?? '';
    const decision = renewOf(e);
    if (filter.decision) {
      if (filter.decision === 'undecided') {
        if (decision !== '') continue;
      } else if (decision !== filter.decision) continue;
    }
    if (q) {
      const hay = `${memberName} ${family} ${courseName}`;
      // כל מילה חייבת להימצא (חיפוש רב-מילתי) — כמו smartFilter במודולים האחרים.
      const words = q.split(/\s+/).filter(Boolean);
      if (!words.every((w) => hay.includes(w))) continue;
    }
    rows.push({
      e,
      member,
      memberName,
      familyName: family,
      course,
      courseName,
      summary: enrollSummary(e),
      decision,
      renewed,
    });
  }
  rows.sort((a, b) => a.memberName.localeCompare(b.memberName, 'he'));
  return rows;
}
