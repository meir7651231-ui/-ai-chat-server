/** חוט · paid-in-range — סכום-ששולם-בטווח של שיבוץ (מגן-מספר). חוזה: paid-in-range.contract.md
 *  חולץ כלשונו מ-maor/src/components/reports/lib.ts:47-52; השכן inRange
 *  הוזרק כשקע (חוק-1 — אפס import פנימי). */
export function paidInRange(e, r, inRange) {
  return (e.payments || [])
    .filter((p) => inRange(p.date, r))
    .reduce((a, p) => a + (Number.isFinite(p.amount) ? p.amount : 0), 0);
}
