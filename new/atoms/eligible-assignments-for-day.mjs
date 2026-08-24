/** חוט · eligible-assignments-for-day — שיוכים פעילים שטרם נמסרו ביום-חלוקה נתון.
 *  חוזה: eligible-assignments-for-day.contract.md
 *  חולץ כלשונו מ-maor/src/components/shop7/lib.ts:38-41. */
export function eligibleAssignmentsForDay(db, dayId) {
  const taken = new Set(db.deliveries.filter((d) => d.dayId === dayId).map((d) => d.assignmentId));
  return db.shopAssignments.filter((a) => a.status === 'active' && !taken.has(a.id));
}
