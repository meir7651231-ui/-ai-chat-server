/** חוט · waitlist-for — רשימת-ההמתנה של חוג (status 'wait', FIFO לפי enrolledAt).
 *  חוזה: waitlist-for.contract.md
 *  חולץ כלשונו מ-maor/src/components/courses/lib.ts:369-373 — טהור, אפס שקעים. */
export function waitlistFor(enrollments, courseId) {
  return enrollments
    .filter((e) => e.courseId === courseId && e.status === 'wait')
    .sort((a, b) => (a.enrolledAt || '').localeCompare(b.enrolledAt || ''));
}
