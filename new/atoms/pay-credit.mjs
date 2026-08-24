/** חוט · pay-credit — יתרת-זכות של שיבוץ. חוזה: pay-credit.contract.md
 *  חולץ כלשונו מ-maor/src/components/courses/lib.ts:319-321 (payCredit); השכן
 *  paidOf (סכום-ששולם) הוזרק כשקע (חוק-1 — אפס import פנימי). */
export function payCredit(e, paidOf) {
  return Math.max(0, paidOf(e) - (e.totalDue || 0) - (e.carryBalance || 0));
}
