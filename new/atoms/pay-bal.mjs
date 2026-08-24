/** חוט · pay-bal — יתרת-חוב על שיבוץ: max(0, סה"כ-עסקה − שולם).
 *  חוזה: pay-bal.contract.md · שקעים: paidOf
 *  חולץ כלשונו מ-maor/src/components/courses/lib.ts (השכן paidOf שוקע — חוק-1). */
export function payBal(e, paidOf) {
  return Math.max(0, (e.totalDue || 0) - paidOf(e));
}
