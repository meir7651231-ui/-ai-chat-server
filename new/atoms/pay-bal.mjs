/** חוט · pay-bal — יתרת-חוב על שיבוץ: max(0, סה"כ-עסקה + חוב-מועבר − שולם).
 *  חוזה: pay-bal.contract.md · שקעים: paidOf
 *  carryBalance (25.8): יתרת-אשתקד נישאת קדימה (חיובי=חוב, שלילי=זכות); חסר=0 ⇒
 *  ביט-זהה לשיבוץ ישן. חולץ כלשונו מ-maor/src/components/courses/lib.ts (paidOf שוקע — חוק-1). */
export function payBal(e, paidOf) {
  return Math.max(0, (e.totalDue || 0) + (e.carryBalance || 0) - paidOf(e));
}
