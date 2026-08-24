/** חוט · balance-of — יתרת-חוב של שיבוץ. חוזה: balance-of.contract.md
 *  חולץ כלשונו מ-maor/src/components/reports/lib.ts:54-56; השכן paidOf
 *  (סה"כ-ששולם) הוזרק כשקע (חוק-1 — אפס import פנימי). */
export function balanceOf(e, paidOf) {
  return Math.max(0, (e.totalDue || 0) - paidOf(e));
}
